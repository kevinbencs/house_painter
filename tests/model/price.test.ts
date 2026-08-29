// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Price from "@/models/Price";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Price model test', () => {
    it('rejects document missing category', async () => {
        await expect(new Price({
            name: 'example',
            price: 10
        }).save()).rejects.toThrow()
    })

    it('rejects document missing name', async () => {
        await expect(new Price({
            category: 'example',
            price: 10
        }).save()).rejects.toThrow()
    })

    it('rejects document missing price', async () => {
        await expect(new Price({
            category: 'example',
            name: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document with non-numeric price', async () => {
        await expect(new Price({
            category: 'example',
            name: 'example',
            price: 'efqw'
        }).save()).rejects.toThrow()
    })

    it('rejects document with duplicate name', async () => {
        await Price.create({
            category: 'example',
            name: 'example',
            price: 10
        })

        await expect(new Price({
            category: 'other',
            name: 'example',
            price: 20
        }).save()).rejects.toThrow()
    })

    it('persists a document without unitOfMea', async () => {
        const created = await Price.create({
            category: 'example',
            name: 'example',
            price: 10
        })
        expect(created.unitOfMea).toBeUndefined()
    })

    it('persists and reads back a valid document', async () => {
        const created = await Price.create({
            category: 'example',
            name: 'example',
            price: 10,
            unitOfMea: 'm2'
        })
        const found = await Price.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})
