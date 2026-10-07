// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Price from '@/models/Price'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { addPrice } from '@/action/addPrice'

useTestDb()

const prev = {} as any

function makeFormData(overrides: Record<string, string | null> = {}) {
    const fd = new FormData()
    const fields: Record<string, string | null> = {
        name: 'Festés',
        category: 'Belső',
        price: '1500',
        unitOfMea: 'm2',
        ...overrides,
    }
    for (const [k, v] of Object.entries(fields)) if (v !== null) fd.set(k, v)
    return fd
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('addPrice', () => {
    it('rejects an unauthenticated caller and saves nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)

        const res = await addPrice(prev, makeFormData())

        expect(res).toEqual({
            error: 'Kérlek jelentkezz be.',
            fieldData: ['1500', 'Belső', 'Festés', 'm2'],
        })
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Price.countDocuments()).toBe(0)
    })

    it('returns a validation message for an empty name', async () => {
        const res = await addPrice(prev, makeFormData({ name: '' }))

        expect(res.failed).toEqual(['A név megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Price.countDocuments()).toBe(0)
    })

    it('returns a validation message for an empty category', async () => {
        const res = await addPrice(prev, makeFormData({ category: '' }))

        expect(res.failed).toEqual(['Kategória megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for an empty unit of measure', async () => {
        const res = await addPrice(prev, makeFormData({ unitOfMea: '' }))

        expect(res.failed).toEqual(['A mértékegység megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a price below 1', async () => {
        const res = await addPrice(prev, makeFormData({ price: '0' }))

        expect(res.failed).toEqual(['Az ár megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('rejects a non-numeric price', async () => {
        const res = await addPrice(prev, makeFormData({ price: 'abc' }))

        expect(res).toHaveProperty('failed')
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Price.countDocuments()).toBe(0)
    })

    it('rejects a decimal price', async () => {
        const res = await addPrice(prev, makeFormData({ price: '12.5' }))

        expect(res).toHaveProperty('failed')
        expect(await Price.countDocuments()).toBe(0)
    })

    it('echoes the submitted fields back on a validation failure', async () => {
        const res = await addPrice(prev, makeFormData({ name: '' }))

        expect(res.fieldData).toEqual(['1500', 'Belső', '', 'm2'])
    })

    it('saves the price and revalidates the price tags on success', async () => {
        const res = await addPrice(prev, makeFormData())

        expect(res).toEqual({ message: 'Festés hozzáadva' })

        const docs = await Price.find()
        expect(docs).toHaveLength(1)
        expect(docs[0].name).toBe('Festés')
        expect(docs[0].category).toBe('Belső')
        expect(docs[0].price).toBe(1500)
        expect(docs[0].unitOfMea).toBe('m2')

        expect(updateTag).toHaveBeenCalledWith('price-data')
        expect(updateTag).toHaveBeenCalledWith('price-cat')
        expect(updateTag).toHaveBeenCalledTimes(2)
    })

    it('strips whitespace from the price before saving', async () => {
        const res = await addPrice(prev, makeFormData({ price: '12 500' }))

        expect(res).toEqual({ message: 'Festés hozzáadva' })
        expect((await Price.findOne())?.price).toBe(12500)
    })

    it('returns an error and saves nothing for a duplicate name', async () => {
        await Price.create({ name: 'Festés', category: 'Külső', price: 1, unitOfMea: 'db' })
        await Price.init()   // make sure the unique index exists

        const res = await addPrice(prev, makeFormData())

        expect(res.error).toContain('already exists')
        expect(res.fieldData).toEqual(['1500', 'Belső', 'Festés', 'm2'])
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Price.countDocuments()).toBe(1)
    })
})
