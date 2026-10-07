// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Image from '@/models/Image'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@vercel/blob', () => ({ del: vi.fn() }))
vi.mock('@/lib/data', () => ({ getNumbOfImagPage: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { del } from '@vercel/blob'
import { getNumbOfImagPage } from '@/lib/data'
import { deleteImage } from '@/action/deleteImage'

useTestDb()

async function seedImage(overrides = {}) {
    return Image.create({
        blobUrl: 'blobs/cat-abc.png',
        newUrl: 'macska.png',
        detail: 'egy cica',
        show: true,
        ...overrides,
    })
}

beforeEach(() => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token')
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
    vi.mocked(del).mockResolvedValue(undefined as any)
    vi.mocked(getNumbOfImagPage).mockResolvedValue(2)
})
afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
})

describe('deleteImage', () => {
    it('rejects an unauthenticated caller and deletes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const img = await seedImage()

        const res = await deleteImage(img._id.toString())

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(del).not.toHaveBeenCalled()
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Image.findById(img._id)).not.toBeNull()
    })

    it('returns a validation message for an invalid id', async () => {
        const img = await seedImage()

        const res = await deleteImage('Bad id')

        expect(res).toEqual({ failed: ['Érvénytele ID'] })
        expect(del).not.toHaveBeenCalled()
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Image.countDocuments()).toBe(1)
        expect(await Image.findById(img._id)).not.toBeNull()
    })

    it('errors when the blob token is not configured and deletes nothing', async () => {
        vi.stubEnv('BLOB_READ_WRITE_TOKEN', '')
        const img = await seedImage()

        const res = await deleteImage(img._id.toString())

        expect(res).toEqual({ error: 'BLOB_READ_WRITE_TOKEN is missed.' })
        expect(del).not.toHaveBeenCalled()
        expect(await Image.findById(img._id)).not.toBeNull()
    })

    it('errors when the id is valid but no image exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()

        const res = await deleteImage(missingId)

        expect(res).toEqual({ error: 'Image is not in the database' })
        expect(del).not.toHaveBeenCalled()
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('deletes the document and its blob, and revalidates every tag', async () => {
        const img = await seedImage()
        const other = await seedImage({ newUrl: 'kutya.png', blobUrl: 'blobs/dog.png' })
        const id = img._id.toString()

        const res = await deleteImage(id)

        expect(res).toEqual({ message: 'Kép törölve.' })
        expect(await Image.findById(img._id)).toBeNull()
        expect(await Image.findById(other._id)).not.toBeNull()   // only the requested image
        expect(del).toHaveBeenCalledWith('blobs/cat-abc.png')

        expect(updateTag).toHaveBeenCalledWith('main-page-images')
        expect(updateTag).toHaveBeenCalledWith('img-numb')
        expect(updateTag).toHaveBeenCalledWith('img-id-' + id)
        expect(updateTag).toHaveBeenCalledWith('getAllImage')
        expect(updateTag).toHaveBeenCalledWith('img-data-1')
        expect(updateTag).toHaveBeenCalledWith('image-site-1')
        expect(updateTag).toHaveBeenCalledWith('img-data-2')
        expect(updateTag).toHaveBeenCalledWith('image-site-2')
        expect(updateTag).toHaveBeenCalledTimes(8)
    })

    it('revalidates a page tag pair for every page', async () => {
        vi.mocked(getNumbOfImagPage).mockResolvedValue(3)
        const img = await seedImage()

        await deleteImage(img._id.toString())

        expect(updateTag).toHaveBeenCalledWith('img-data-3')
        expect(updateTag).toHaveBeenCalledWith('image-site-3')
        expect(updateTag).toHaveBeenCalledTimes(10)
    })

    it('returns a server error when deleting the blob fails', async () => {
        vi.mocked(del).mockRejectedValueOnce(new Error('blob down'))
        vi.spyOn(console, 'error').mockImplementation(() => { })
        const img = await seedImage()

        const res = await deleteImage(img._id.toString())

        expect(res).toEqual({ error: 'Server error' })
        expect(updateTag).not.toHaveBeenCalled()
        // NOTE: the document is removed BEFORE the blob is deleted, so a
        // blob failure leaves an orphaned file and no database record.
        expect(await Image.findById(img._id)).toBeNull()

        vi.restoreAllMocks()
    })

    it('returns a server error when the database call fails', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => { })
        vi.spyOn(Image, 'findByIdAndDelete').mockRejectedValueOnce(new Error('boom'))
        const img = await seedImage()

        const res = await deleteImage(img._id.toString())

        expect(res).toEqual({ error: 'Server error' })
        expect(del).not.toHaveBeenCalled()
        expect(updateTag).not.toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
