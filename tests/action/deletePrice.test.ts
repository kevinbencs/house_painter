// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Price from '@/models/Price'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { deletePrice } from '@/action/deletePrice'

useTestDb()

async function seedPrice(overrides = {}) {
    return Price.create({
        name: 'Festés',
        category: 'Belső',
        price: 1000,
        unitOfMea: 'm2',
        ...overrides,
    })
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('deletePrice', () => {
    it('rejects an unauthenticated caller and deletes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const price = await seedPrice()

        const res = await deletePrice(price._id.toString())

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Price.findById(price._id)).not.toBeNull()
    })

    it('returns a validation message for an invalid id and deletes nothing', async () => {
        const price = await seedPrice()

        const res = await deletePrice('Bad id')

        expect(res).toEqual({ failed: ['Érvénytele ID'] })
        expect(updateTag).not.toHaveBeenCalled()
        expect(await Price.countDocuments()).toBe(1)
        expect(await Price.findById(price._id)).not.toBeNull()
    })

    it('deletes only the requested price and revalidates the price tags', async () => {
        const price = await seedPrice({ name: 'A' })
        const other = await seedPrice({ name: 'B' })

        const res = await deletePrice(price._id.toString())

        expect(res).toEqual({ message: 'Ár törölve' })
        expect(await Price.findById(price._id)).toBeNull()
        expect(await Price.findById(other._id)).not.toBeNull()

        expect(updateTag).toHaveBeenCalledWith('price-data')
        expect(updateTag).toHaveBeenCalledWith('price-cat')
        expect(updateTag).toHaveBeenCalledTimes(2)
    })

    // findByIdAndDelete resolves to null for an unknown id and the action
    // does not check that, so it still reports success.
    it('reports success when the id is valid but no price exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()

        const res = await deletePrice(missingId)

        expect(res).toEqual({ message: 'Ár törölve' })
    })

    it('returns a server error when the database call fails', async () => {
        const price = await seedPrice()
        vi.spyOn(Price, 'findByIdAndDelete').mockRejectedValueOnce(new Error('boom'))

        const res = await deletePrice(price._id.toString())

        expect(res).toEqual({ error: 'Server error' })
        expect(updateTag).not.toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
