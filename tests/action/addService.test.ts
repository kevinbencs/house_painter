// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Service from '@/models/Service'


vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/checkTextBSP', () => ({ chooseTypeOfTextItem: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'
import { addService } from '@/action/addService' 


useTestDb()

function makeFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  const fields = {
    heading: 'My first service',
    text: 'First line\nSecond line',
    detail: 'A short summary',
    keywords: 'test, service',
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

describe('addService', () => {
  it('rejects an unauthenticated caller and writes nothing', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)

    const res = await addService(makeFormData())

    expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('returns validation messages for an invalid heading', async () => {
    const res = await addService(makeFormData({ heading: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Címet kötelező megadni'])
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid text', async () => {
    const res = await addService(makeFormData({ text: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Szöveget kötelező megadni'])
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid detail', async () => {
    const res = await addService(makeFormData({ detail: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['A leírás megadása kötelező'])
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid keywords', async () => {
    const res = await addService(makeFormData({ keywords: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Kulcsszavakat kötelező megadni'])
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid image', async () => {
    const res = await addService(makeFormData({ image: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Egy kép id-jének megadása kötelező'])
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('returns an error when a text line fails the type check', async () => {
    vi.mocked(chooseTypeOfTextItem).mockReturnValueOnce('Error: bad line')

    const res = await addService(makeFormData())

    expect(res).toEqual({ error: 'Error: bad line' })
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('saves the Service and revalidates the cache tags on success', async () => {
    const res = await addService(makeFormData())

    expect(res).toEqual({ message: 'Szolgáltatás hozzáadva' })

    const docs = await Service.find()
    expect(docs).toHaveLength(1)
    expect(docs[0].heading).toBe('My first service')
    expect(docs[0].visibility).toBe(false)

    expect(updateTag).toHaveBeenCalledWith('service-list')
    expect(updateTag).toHaveBeenCalledWith('main-page-services')
    expect(updateTag).toHaveBeenCalledWith('service-topbar')
    expect(updateTag).toHaveBeenCalledWith('service-footer')
    expect(updateTag).toHaveBeenCalledTimes(4)
  })

  it('returns 500 on duplicate-key error', async () => {
    vi.spyOn(Service.prototype, 'save').mockRejectedValueOnce(
      Object.assign(new Error('dup'), {
        code: 11000, keyValue: {
          heading: 'My first service',
          text: 'First line\nSecond line',
          detail: 'A short summary',
          keywords: 'test, service',
          image: 'pic-1',
        }
      })
    )

    const res = await addService(makeFormData())


    expect(res.error).toContain('already exists')
    expect(await Service.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })
})