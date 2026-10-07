// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Place from '@/models/Place'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/checkTextBSP', () => ({ chooseTypeOfTextItem: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'
import { updatePlace } from '@/action/updatePlace'


useTestDb()

async function seedPlace(overrides = {}) {
    return Place.create({
        heading: '1011. Budapest district',
        text: 'a line',
        detail: 'summary',
        image: 'pic-1',
        keywords: 'test',
        visibility: false,
        headingParahg: 'a paragraph',
        ...overrides,
    })
}

function makeFormData(_id: string, overrides: Record<string, string> = {}) {
    const fd = new FormData()
    const fields = {
        heading: 'Updated heading',
        text: 'Updated text',
        detail: 'Updated detail',
        keywords: 'updated, keywords',
        image: 'pic-2',
        paragh: 'Updated paragraph',
        _id,
        ...overrides,
    }
    for (const [k, v] of Object.entries(fields)) fd.set(k, v)
    return fd
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
    vi.mocked(chooseTypeOfTextItem).mockReturnValue('paragraph')
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('updatePlace', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const place = await seedPlace()

        const res = await updatePlace(makeFormData(place._id.toString()))

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Place.findById(place._id)
        expect(fresh?.heading).toBe('1011. Budapest district')   // untouched
    })

    it('returns validation messages for an invalid heading', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { heading: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Címet kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid text', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { text: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Szöveget kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid detail', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { detail: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['A leírás megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid keywords', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { keywords: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Kulcsszavakat kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid image', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { image: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Egy kép id-jének megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid paragh', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { paragh: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['A cím alatti leírás megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for a missing _id', async () => {

        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { _id: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Az oldal id-jének megadása kötelező', 'Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a malformed (non-ObjectId) _id', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { _id: 'not-a-valid-id' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns an error when a text line fails the type check', async () => {
        vi.mocked(chooseTypeOfTextItem).mockReturnValueOnce('Error: bad line')
        const place = await seedPlace()

        const res = await updatePlace(makeFormData(place._id.toString()))

        expect(res).toEqual({ error: 'Error: bad line' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Place.findById(place._id)
        expect(fresh?.heading).toBe('1011. Budapest district')   
    })


    it('saves the place and revalidates all five tags on success', async () => {
        const place = await seedPlace()

        const res = await updatePlace(makeFormData(place._id.toString(), {
            heading: 'Updated heading',
            text: 'First line\r\nSecond line',
        }))

        expect(res).toEqual({ message: 'A település módosítva' })

        const fresh = await Place.findById(place._id)
        expect(fresh?.heading).toBe('Updated heading')
        expect(fresh?.text).toBe('First line\nSecond line')   
        expect(fresh?.detail).toBe('Updated detail')
        expect(fresh?.keywords).toBe('updated, keywords')
        expect(fresh?.image).toBe('pic-2')
        expect(fresh?.headingParahg).toBe('Updated paragraph')

        expect(updateTag).toHaveBeenCalledWith('place-list')
        expect(updateTag).toHaveBeenCalledWith('place-footer')
        expect(updateTag).toHaveBeenCalledWith('place-1011.-Budapes')
        expect(updateTag).toHaveBeenCalledWith('place-page-1011.-Budapes')
        expect(updateTag).toHaveBeenCalledWith('placeDashboardData')
        expect(updateTag).toHaveBeenCalledTimes(5)
    })

    it('cuts an old heading without a "." after its first 8 characters', async () => {
        const place = await seedPlace({ heading: 'My first place' })

        const res = await updatePlace(makeFormData(place._id.toString()))

        expect(res).toEqual({ message: 'A település módosítva' })
        expect(updateTag).toHaveBeenCalledWith('place-My-first')
        expect(updateTag).toHaveBeenCalledWith('place-page-My-first')
    })

    it('errors when the id is valid but no place exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()
        const res = await updatePlace(makeFormData(missingId))

        expect(res).toEqual({ error: 'A hely nem található.' })
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns an error on duplicate-key error', async () => {
        const place = await seedPlace()
        vi.spyOn(Place, 'findByIdAndUpdate').mockRejectedValueOnce(
            Object.assign(new Error('dup'), { code: 11000, keyValue: { heading: 'Updated heading' } })
        )

        const res = await updatePlace(makeFormData(place._id.toString()))

        expect(res.error).toContain('already exists')
        expect(updateTag).not.toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
