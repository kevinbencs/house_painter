// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Service from '@/models/Service'


vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { deleteService } from '@/action/deleteService'


useTestDb()

async function seedService(overrides = {}) {
    return Service.create({
        heading: 'My first blog',
        text: 'a line',
        detail: 'summary',
        image: 'pic-1',
        keywords: 'test',
        visibility: true,
        headingParahg: 'a paragraph',
        ...overrides,
    })
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('deletePlace', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const place = await seedService()

        const res = await deleteService(place._id.toString())

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Service.findById(place._id)
        expect(fresh?.visibility).toBe(true)  
    })

    it('returns validation messages for an invalid id', async () => {
        const res = await deleteService('Bad id')   

        expect(res).toHaveProperty('failed')
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('hides the place and revalidates all four tags on success', async () => {
        const place = await seedService({ heading: 'My first blog' })

        const res = await deleteService(place._id.toString())

        expect(res).toEqual({ message: 'Szolgáltatás törölve.' })

        const fresh = await Service.findById(place._id)
        expect(fresh?.visibility).toBe(false)   

        expect(updateTag).toHaveBeenCalledWith('service-list')
        expect(updateTag).toHaveBeenCalledWith('main-page-services')
        expect(updateTag).toHaveBeenCalledWith('service-topbar')
        expect(updateTag).toHaveBeenCalledWith('service-footer')
        expect(updateTag).toHaveBeenCalledWith('service-page-'+'My first blog'.replaceAll(" ", "-"))
        expect(updateTag).toHaveBeenCalledWith(`service-${'My first blog'.replaceAll(" ", "-")}`)
        expect(updateTag).toHaveBeenCalledTimes(6)
    })

    it('errors when the id is valid but no place exists', async () => {
        
        const missingId = new mongoose.Types.ObjectId().toString()

        const res = await deleteService(missingId)

        expect(res).toHaveProperty('error')    
        expect(updateTag).not.toHaveBeenCalled()
    })


})