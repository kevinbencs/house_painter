// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Place from '@/models/Place'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { deletePlace } from '@/action/deletePlace'


useTestDb()

async function seedPlace(overrides = {}) {
    return Place.create({
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
        const place = await seedPlace()

        const res = await deletePlace(place._id.toString())

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Place.findById(place._id)
        expect(fresh?.visibility).toBe(true)   // untouched
    })

    it('returns validation messages for an invalid id', async () => {
        const res = await deletePlace('Bad id')   // adjust to what deleteSchema rejects

        expect(res).toHaveProperty('failed')
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('hides the place and revalidates all four tags on success', async () => {
        const place = await seedPlace({ heading: 'My first blog' })

        const res = await deletePlace(place._id.toString())

        expect(res).toEqual({ message: 'Hely törölve.' })

        const fresh = await Place.findById(place._id)
        expect(fresh?.visibility).toBe(false)   // the actual state change

        expect(updateTag).toHaveBeenCalledWith('place-list')
        expect(updateTag).toHaveBeenCalledWith('place-footer')
        expect(updateTag).toHaveBeenCalledWith('place-My-first')
        expect(updateTag).toHaveBeenCalledWith('place-page-My-first')
        expect(updateTag).toHaveBeenCalledTimes(4)
    })

    it('errors when the id is valid but no place exists', async () => {
        
        const missingId = new mongoose.Types.ObjectId().toString()

        const res = await deletePlace(missingId)

        expect(res).toHaveProperty('error')     // currently 'Server error'
        expect(updateTag).not.toHaveBeenCalled()
    })


})
