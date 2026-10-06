// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Image from '@/models/Image'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/data', () => ({ getAllImg: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { getAllImg } from '@/lib/data'
import { updateImage } from '@/action/updateImage'

useTestDb()

const prev = {} as any

async function seedImage(overrides = {}) {
    return Image.create({
        blobUrl: 'blobs/cat.png',
        newUrl: 'macska.png',
        detail: 'egy cica',
        show: false,
        ...overrides,
    })
}

function makeFormData(_id: string, overrides: Record<string, string | null> = {}) {
    const fd = new FormData()
    const fields: Record<string, string | null> = {
        _id,
        detail: 'Updated detail',
        newUrl: 'updated.png',
        'image-visibility': 'on',
        ...overrides,
    }
    for (const [k, v] of Object.entries(fields)) if (v !== null) fd.set(k, v)
    return fd
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
    vi.mocked(getAllImg).mockResolvedValue([] as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('updateImage', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const img = await seedImage()

        const res = await updateImage(prev, makeFormData(img._id.toString()))

        expect(res).toMatchObject({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Image.findById(img._id)
        expect(fresh?.detail).toBe('egy cica')   // untouched
    })

    it('returns validation messages for an invalid detail', async () => {
        const img = await seedImage()
        const res = await updateImage(prev, makeFormData(img._id.toString(), { detail: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['A leírás megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid newUrl', async () => {
        const img = await seedImage()
        const res = await updateImage(prev, makeFormData(img._id.toString(), { newUrl: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Az url megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for an invalid visibility value', async () => {
        const img = await seedImage()
        const res = await updateImage(prev, makeFormData(img._id.toString(), { 'image-visibility': 'maybe' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Láthatóság megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for a missing _id', async () => {
        // `_id` is chained with both .min(1) and a 24-hex-char .refine(), so
        // an empty string fails both checks and both messages are reported.
        const img = await seedImage()
        const res = await updateImage(prev, makeFormData(img._id.toString(), { _id: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Az oldal id-jének megadása kötelező', 'Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a malformed (non-ObjectId) _id', async () => {
        const img = await seedImage()
        const res = await updateImage(prev, makeFormData(img._id.toString(), { _id: 'not-a-valid-id' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('echoes the submitted fields back on a validation failure', async () => {
        const img = await seedImage()
        const id = img._id.toString()
        const res = await updateImage(prev, makeFormData(id, { detail: '' }))

        expect(res.fieldData).toEqual([id, '', 'updated.png', 'on'])
    })

    it('saves the image and revalidates the tags on success', async () => {
        const img = await seedImage()
        const id = img._id.toString()
        vi.mocked(getAllImg).mockResolvedValue([{ _id: id }] as any)

        const res = await updateImage(prev, makeFormData(id))

        expect(res).toEqual({ message: 'Kép adatai módosítva' })

        const fresh = await Image.findById(img._id)
        expect(fresh?.detail).toBe('Updated detail')
        expect(fresh?.newUrl).toBe('updated.png')
        expect(fresh?.show).toBe(true)

        expect(updateTag).toHaveBeenCalledWith('img-id-' + id)
        expect(updateTag).toHaveBeenCalledWith('main-page-images')
        expect(updateTag).toHaveBeenCalledWith('getAllImage')
        expect(updateTag).toHaveBeenCalledWith('img-data-1')
        expect(updateTag).toHaveBeenCalledWith('image-site-1')
    })

    it('hides the image when the visibility checkbox is not submitted', async () => {
        const img = await seedImage({ show: true })
        const id = img._id.toString()
        vi.mocked(getAllImg).mockResolvedValue([{ _id: id }] as any)

        const res = await updateImage(prev, makeFormData(id, { 'image-visibility': null }))

        expect(res).toEqual({ message: 'Kép adatai módosítva' })
        const fresh = await Image.findById(img._id)
        expect(fresh?.show).toBe(false)
    })

    it('returns an error on duplicate-key error', async () => {
        const img = await seedImage()
        vi.spyOn(Image, 'findByIdAndUpdate').mockRejectedValueOnce(
            Object.assign(new Error('dup'), { code: 11000, keyValue: { newUrl: 'updated.png' } })
        )

        const res = await updateImage(prev, makeFormData(img._id.toString()))

        expect(res.error).toContain('already exists')
        expect(updateTag).not.toHaveBeenCalledWith('main-page-images')

        vi.restoreAllMocks()
    })
})
