// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Price from '@/models/Price'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { updatePrice } from '@/action/updatePrice'

useTestDb()

const prev = {} as any

type Row = { _id: string, name: string, category: string, price: string, unitOfMea: string }

async function seedPrice(overrides = {}) {
    return Price.create({
        name: 'Festés',
        category: 'Belső',
        price: 1000,
        unitOfMea: 'm2',
        ...overrides,
    })
}

// updatePrice reads every FormData value positionally: the first four
// entries are skipped, then each row is five entries
// (_id, name, category, price, unitOfMea).
function makeFormData(rows: Row[]) {
    const fd = new FormData()
    for (let i = 0; i < 4; i++) fd.append(`header-${i}`, 'x')
    for (const r of rows) {
        fd.append('_id', r._id)
        fd.append('name', r.name)
        fd.append('category', r.category)
        fd.append('price', r.price)
        fd.append('unitOfMea', r.unitOfMea)
    }
    return fd
}

function row(_id: string, overrides: Partial<Row> = {}): Row {
    return {
        _id,
        name: 'Updated name',
        category: 'Updated category',
        price: '2500',
        unitOfMea: 'db',
        ...overrides,
    }
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('updatePrice', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const p = await seedPrice()

        const res = await updatePrice(prev, makeFormData([row(p._id.toString())]))

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.', fieldData: [''] })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Price.findById(p._id)
        expect(fresh?.name).toBe('Festés')   // untouched
    })

    it('returns a validation message for an invalid name', async () => {
        const p = await seedPrice()
        const res = await updatePrice(prev, makeFormData([row(p._id.toString(), { name: '' })]))

        expect(res.failed).toEqual(['A név megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for an invalid category', async () => {
        const p = await seedPrice()
        const res = await updatePrice(prev, makeFormData([row(p._id.toString(), { category: '' })]))

        expect(res.failed).toEqual(['Kategória megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for an invalid unit of measure', async () => {
        const p = await seedPrice()
        const res = await updatePrice(prev, makeFormData([row(p._id.toString(), { unitOfMea: '' })]))

        expect(res.failed).toEqual(['A mértékegység megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a price below 1', async () => {
        const p = await seedPrice()
        const res = await updatePrice(prev, makeFormData([row(p._id.toString(), { price: '0' })]))

        expect(res.failed).toEqual(['Az ár megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a malformed (non-ObjectId) _id', async () => {
        const res = await updatePrice(prev, makeFormData([row('not-a-valid-id')]))

        expect(res.failed).toEqual(['Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('writes nothing when any one row is invalid', async () => {
        const a = await seedPrice({ name: 'A' })
        const b = await seedPrice({ name: 'B' })

        const res = await updatePrice(prev, makeFormData([
            row(a._id.toString(), { name: 'A2' }),
            row(b._id.toString(), { name: '' }),
        ]))

        expect(res).toHaveProperty('failed')
        expect((await Price.findById(a._id))?.name).toBe('A')   // first row not saved either
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('saves every row and revalidates the price tags on success', async () => {
        const a = await seedPrice({ name: 'A' })
        const b = await seedPrice({ name: 'B' })

        const res = await updatePrice(prev, makeFormData([
            row(a._id.toString(), { name: 'A2', price: '1500' }),
            row(b._id.toString(), { name: 'B2', price: '2 500' }),   // spaces are stripped
        ]))

        expect(res).toEqual({ message: 'Mentve' })

        const freshA = await Price.findById(a._id)
        expect(freshA?.name).toBe('A2')
        expect(freshA?.price).toBe(1500)
        expect(freshA?.category).toBe('Updated category')
        expect(freshA?.unitOfMea).toBe('db')

        const freshB = await Price.findById(b._id)
        expect(freshB?.name).toBe('B2')
        expect(freshB?.price).toBe(2500)

        expect(updateTag).toHaveBeenCalledWith('price-data')
        expect(updateTag).toHaveBeenCalledWith('price-cat')
        expect(updateTag).toHaveBeenCalledTimes(2)
    })

    it('does not fail when the id is valid but no price exists', async () => {
        // bulkWrite replaceOne silently matches nothing for an unknown id.
        const missingId = new mongoose.Types.ObjectId().toString()
        const res = await updatePrice(prev, makeFormData([row(missingId)]))

        expect(res).toEqual({ message: 'Mentve' })
        expect(await Price.countDocuments()).toBe(0)
    })

    it('returns an error on duplicate-key error', async () => {
        const p = await seedPrice()
        vi.spyOn(Price, 'bulkWrite').mockRejectedValueOnce(
            Object.assign(new Error('dup'), { code: 11000, keyValue: { name: 'Updated name' } })
        )

        const res = await updatePrice(prev, makeFormData([row(p._id.toString())]))

        expect(res.error).toContain('already exists')
        expect(res.fieldData).toEqual([''])
        expect(updateTag).not.toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
