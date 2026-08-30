// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Blog from '@/models/Blog'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/checkTextBSP', () => ({ chooseTypeOfTextItem: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'
import { updateBlog } from '@/action/updateBlog'


useTestDb()

async function seedBlog(overrides = {}) {
    return Blog.create({
        heading: 'My first blog',
        text: 'a line',
        detail: 'summary',
        image: 'pic-1',
        keywords: 'test',
        visibility: false,
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

describe('updateBlog', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const blog = await seedBlog()

        const res = await updateBlog(makeFormData(blog._id.toString()))

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Blog.findById(blog._id)
        expect(fresh?.heading).toBe('My first blog')   // untouched
    })

    it('returns validation messages for an invalid heading', async () => {
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { heading: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Címet kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid text', async () => {
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { text: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Szöveget kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid detail', async () => {
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { detail: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['A leírás megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid keywords', async () => {
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { keywords: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Kulcsszavakat kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid image', async () => {
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { image: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Egy kép id-jének megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for a missing _id', async () => {
        // `_id` is chained with both .min(1) and a 24-hex-char .refine(), so
        // an empty string fails both checks and both messages are reported.
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { _id: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Az oldal id-jének megadása kötelező', 'Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a malformed (non-ObjectId) _id', async () => {
        const blog = await seedBlog()
        const res = await updateBlog(makeFormData(blog._id.toString(), { _id: 'not-a-valid-id' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns an error when a text line fails the type check', async () => {
        vi.mocked(chooseTypeOfTextItem).mockReturnValueOnce('Error: bad line')
        const blog = await seedBlog()

        const res = await updateBlog(makeFormData(blog._id.toString()))

        expect(res).toEqual({ error: 'Error: bad line' })
        expect(updateTag).not.toHaveBeenCalled()
    })

    // NOTE: updateBlog strips '\n' (not '\r' like addBlog) from every field.
    // A multi-line `text` value therefore has its line breaks removed
    // before being saved -- the lines end up concatenated together.
    it('saves the blog and revalidates all four tags on success', async () => {
        const blog = await seedBlog()

        const res = await updateBlog(makeFormData(blog._id.toString(), {
            heading: 'Updated heading',
            text: 'First line\nSecond line',
        }))

        expect(res).toEqual({ message: 'Blog módosítva' })

        const fresh = await Blog.findById(blog._id)
        expect(fresh?.heading).toBe('Updated heading')
        expect(fresh?.text).toBe('First lineSecond line')   // newlines stripped

        expect(updateTag).toHaveBeenCalledWith('blog-list')
        expect(updateTag).toHaveBeenCalledWith('main-page-blogs')
        expect(updateTag).toHaveBeenCalledWith('blog-Updated-heading')
        expect(updateTag).toHaveBeenCalledWith('blog-page-Updated-heading')
        expect(updateTag).toHaveBeenCalledTimes(4)
    })

    it('errors when the id is valid but no blog exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()
        const res = await updateBlog(makeFormData(missingId))

        expect(res).toEqual({ error: 'A blog nem található.' })
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns 500 on duplicate-key error', async () => {
        const blog = await seedBlog()
        vi.spyOn(Blog, 'findByIdAndUpdate').mockRejectedValueOnce(
            Object.assign(new Error('dup'), { code: 11000, keyValue: { heading: 'Updated heading' } })
        )

        const res = await updateBlog(makeFormData(blog._id.toString()))

        expect(res.error).toContain('already exists')
        expect(updateTag).not.toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
