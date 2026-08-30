// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Place from '@/models/Place'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { displayPlace } from '@/action/displayPlace'


useTestDb()

async function seedPlace(overrides = {}) {
    return Place.create({
        heading: 'My first blog',
        text: 'a line',
        detail: 'summary',
        image: 'pic-1',
        keywords: 'test',
        visibility: false,
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

describe('displayPlace', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const place = await seedPlace()

        const res = await displayPlace(place._id.toString())

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Place.findById(place._id)
        expect(fresh?.visibility).toBe(false)   // untouched
    })

    it('returns validation messages for an invalid id', async () => {
        const res = await displayPlace('Bad id')   // adjust to what deleteSchema rejects

        expect(res).toHaveProperty('failed')
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('shows the place and revalidates all four tags on success', async () => {
        const place = await seedPlace({ heading: 'My first blog' })

        const res = await displayPlace(place._id.toString())

        expect(res).toEqual({ message: 'Hely visszaállítva.' })

        const fresh = await Place.findById(place._id)
        expect(fresh?.visibility).toBe(true)   // the actual state change

        expect(updateTag).toHaveBeenCalledWith('place-list')
        expect(updateTag).toHaveBeenCalledWith('place-footer')
        expect(updateTag).toHaveBeenCalledWith('place-My-first')
        expect(updateTag).toHaveBeenCalledWith('place-page-My-first')
        expect(updateTag).toHaveBeenCalledTimes(4)
    })

    it('errors when the id is valid but no place exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()

        const res = await displayPlace(missingId)

        expect(res).toEqual({ error: 'A hely nem található.' })
        expect(updateTag).not.toHaveBeenCalled()
    })
})
