// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Blog from '@/models/Blog'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { deleteBlog } from '@/action/deleteBlog'


useTestDb()

async function seedBlog(overrides = {}) {
    return Blog.create({
        heading: 'My first blog',
        text: 'a line',
        detail: 'summary',
        image: 'pic-1',
        keywords: 'test',
        visibility: true,
        ...overrides,
    })
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('deleteBlog', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const blog = await seedBlog()

        const res = await deleteBlog(blog._id.toString())

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Blog.findById(blog._id)
        expect(fresh?.visibility).toBe(true)   // untouched
    })

    it('returns validation messages for an invalid id', async () => {
        const res = await deleteBlog('Bad id')   // adjust to what deleteSchema rejects

        expect(res).toHaveProperty('failed')
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('hides the blog and revalidates all four tags on success', async () => {
        const blog = await seedBlog({ heading: 'My first blog' })

        const res = await deleteBlog(blog._id.toString())

        expect(res).toEqual({ message: 'Blog törölve.' })

        const fresh = await Blog.findById(blog._id)
        expect(fresh?.visibility).toBe(false)   // the actual state change

        expect(updateTag).toHaveBeenCalledWith('blog-list')
        expect(updateTag).toHaveBeenCalledWith('main-page-blogs')
        expect(updateTag).toHaveBeenCalledWith('blog-My-first-blog')
        expect(updateTag).toHaveBeenCalledWith('blog-page-My-first-blog')
        expect(updateTag).toHaveBeenCalledTimes(4)
    })

    it('errors when the id is valid but no blog exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()

        const res = await deleteBlog(missingId)

        expect(res).toHaveProperty('error')     // currently 'Server error'
        expect(updateTag).not.toHaveBeenCalled()
    })

    
})