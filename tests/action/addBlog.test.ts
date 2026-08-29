// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Blog from '@/models/Blog'


vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/checkTextBSP', () => ({ chooseTypeOfTextItem: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'
import { addBlog } from '@/action/addBlog'


useTestDb()

function makeFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  const fields = {
    heading: 'My first blog',
    text: 'First line\nSecond line',
    detail: 'A short summary',
    keywords: 'test, blog',
    image: 'pic-1',
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

describe('addBlog', () => {
  it('rejects an unauthenticated caller and writes nothing', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)

    const res = await addBlog(makeFormData())

    expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
    expect(await Blog.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('returns validation messages for an invalid body', async () => {
    const res = await addBlog(makeFormData({ heading: '' }))   

    expect(res).toHaveProperty('failed')
    expect(await Blog.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('returns an error when a text line fails the type check', async () => {
    vi.mocked(chooseTypeOfTextItem).mockReturnValueOnce('Error: bad line')

    const res = await addBlog(makeFormData())

    expect(res).toEqual({ error: 'Error: bad line' })
    expect(await Blog.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('saves the blog and revalidates the cache tags on success', async () => {
    const res = await addBlog(makeFormData())

    expect(res).toEqual({ message: 'Blog létrehozva' })

    const docs = await Blog.find()
    expect(docs).toHaveLength(1)
    expect(docs[0].heading).toBe('My first blog')
    expect(docs[0].visibility).toBe(false)

    expect(updateTag).toHaveBeenCalledWith('blog-list')
    expect(updateTag).toHaveBeenCalledWith('main-page-blogs')
    expect(updateTag).toHaveBeenCalledTimes(2)
  })
})