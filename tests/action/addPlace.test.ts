// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Place from '@/models/Place'


vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/checkTextBSP', () => ({ chooseTypeOfTextItem: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'
import { addPlace } from '@/action/addPlace'


useTestDb()

function makeFormData(overrides: Record<string, string> = {}) {
  const fd = new FormData()
  const fields = {
    heading: 'My first place',
    text: 'First line\nSecond line',
    detail: 'A short summary',
    keywords: 'test, place',
    image: 'pic-1',
    paragh: 'A short heading paragraph',
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

describe('addPlace', () => {
  // NOTE: the checkAuth() call in action/addPlace.ts is currently commented
  // out, so an unauthenticated caller is NOT rejected. This documents the
  // actual current behavior rather than the (likely intended) auth check.
  it('saves the place even when checkAuth reports an error', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)

    const res = await addPlace(makeFormData())

    expect(res).toEqual({ message: 'Új hely hozzáadva' })
    expect(await Place.countDocuments()).toBe(1)
  })

  it('returns validation messages for an invalid heading', async () => {
    const res = await addPlace(makeFormData({ heading: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Címet kötelező megadni'])
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid text', async () => {
    const res = await addPlace(makeFormData({ text: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Szöveget kötelező megadni'])
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid detail', async () => {
    const res = await addPlace(makeFormData({ detail: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['A leírás megadása kötelező'])
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid keywords', async () => {
    const res = await addPlace(makeFormData({ keywords: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Kulcsszavakat kötelező megadni'])
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid image', async () => {
    const res = await addPlace(makeFormData({ image: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['Egy kép id-jének megadása kötelező'])
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })
  it('returns validation messages for an invalid paragh', async () => {
    const res = await addPlace(makeFormData({ paragh: '' }))

    expect(res).toHaveProperty('failed')
    expect(Array.isArray(res.failed)).toBe(true)
    expect(res.failed).toEqual(['A cím alatti leírás megadása kötelező'])
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('returns an error when a text line fails the type check', async () => {
    vi.mocked(chooseTypeOfTextItem).mockReturnValueOnce('Error: bad line')

    const res = await addPlace(makeFormData())

    expect(res).toEqual({ error: 'Error: bad line' })
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('saves the place and revalidates the cache tags on success', async () => {
    const res = await addPlace(makeFormData())

    expect(res).toEqual({ message: 'Új hely hozzáadva' })

    const docs = await Place.find()
    expect(docs).toHaveLength(1)
    expect(docs[0].heading).toBe('My first place')
    expect(docs[0].headingParahg).toBe('A short heading paragraph')
    expect(docs[0].visibility).toBe(true)

    expect(updateTag).toHaveBeenCalledWith('place-list')
    expect(updateTag).toHaveBeenCalledWith('place-footer')
    expect(updateTag).toHaveBeenCalledTimes(2)
  })

  it('returns 500 on duplicate-key error', async () => {
    vi.spyOn(Place.prototype, 'save').mockRejectedValueOnce(
      Object.assign(new Error('dup'), {
        code: 11000, keyValue: {
          heading: 'My first place',
          text: 'First line\nSecond line',
          detail: 'A short summary',
          keywords: 'test, place',
          image: 'pic-1',
          headingParahg: 'A short heading paragraph',
        }
      })
    )

    const res = await addPlace(makeFormData())


    expect(res.error).toContain('already exists')
    expect(await Place.countDocuments()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()

    vi.restoreAllMocks()
  })
})
