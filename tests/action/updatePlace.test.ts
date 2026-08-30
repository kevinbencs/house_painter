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
// action/updatePlace.ts names its exported function `updateImage` (a
// copy-paste artifact from action/updateImage.ts). Nothing in the app
// currently imports "@/action/updatePlace" at all.
import {  updatePlace } from '@/action/updatePlace'


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

describe('updatePlace (action/updatePlace.ts export "updateImage")', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const place = await seedPlace()

        const res = await updatePlace(makeFormData(place._id.toString()))

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
    })

    // BUG: the action never reads formData.get('paragh'), so `paragh` is
    // never included in the object passed to placeSchemaId.safeParse().
    // Since `paragh` is a required schema field, validation fails on EVERY
    // call -- even with an otherwise fully valid form -- so the update path
    // (the text-line check, the DB write, and the cache revalidation) can
    // never be reached as this action is currently written.
    it('always fails validation, even with an otherwise fully valid form', async () => {
        const place = await seedPlace()

        const res = await updatePlace(makeFormData(place._id.toString()))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Invalid input: expected string, received undefined'])
        expect(updateTag).not.toHaveBeenCalled()

        const fresh = await Place.findById(place._id)
        expect(fresh?.heading).toBe('My first blog')   // never actually updated
    })

    it('reports both the field error and the always-missing paragh error', async () => {
        const place = await seedPlace()
        const res = await updatePlace(makeFormData(place._id.toString(), { heading: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual([
            'Címet kötelező megadni',
            'Invalid input: expected string, received undefined',
        ])
        expect(updateTag).not.toHaveBeenCalled()
    })
})
