// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Service from "@/models/Service";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Service model test', () => {
    it('rejects document missing heading', async () => {
        await expect(new Service({
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing text', async () => {
        await expect(new Service({
            heading: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing detail', async () => {
        await expect(new Service({
            heading: 'example',
            text: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing keywords', async () => {
        await expect(new Service({
            heading: 'example',
            text: 'example',
            detail: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing image', async () => {
        await expect(new Service({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document string visibility', async () => {
        await expect(new Service({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: 'efqw'
        }).save()).rejects.toThrow()
    })

    it('rejects document with duplicate heading', async () => {
        await Service.create({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        })

        await expect(new Service({
            heading: 'example',
            text: 'other',
            detail: 'other',
            keywords: 'other',
            image: 'other',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('persists and reads back a valid document', async () => {
        const created = await Service.create({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        })
        const found = await Service.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})
