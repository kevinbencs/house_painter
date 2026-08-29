// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Place from "@/models/Place";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Place model test', () => {
    it('rejects document missing heading', async () => {
        await expect(new Place({
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing text', async () => {
        await expect(new Place({
            heading: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing detail', async () => {
        await expect(new Place({
            heading: 'example',
            text: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing keywords', async () => {
        await expect(new Place({
            heading: 'example',
            text: 'example',
            detail: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing image', async () => {
        await expect(new Place({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            visibility: false,
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing headingParahg', async () => {
        await expect(new Place({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document string visibility', async () => {
        await expect(new Place({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: 'efqw',
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document with duplicate heading', async () => {
        await Place.create({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example-one'
        })

        await expect(new Place({
            heading: 'example',
            text: 'other',
            detail: 'other',
            keywords: 'other',
            image: 'other',
            visibility: false,
            headingParahg: 'example-two'
        }).save()).rejects.toThrow()
    })

    it('rejects document with duplicate headingParahg', async () => {
        await Place.create({
            heading: 'example-one',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example'
        })

        await expect(new Place({
            heading: 'example-two',
            text: 'other',
            detail: 'other',
            keywords: 'other',
            image: 'other',
            visibility: false,
            headingParahg: 'example'
        }).save()).rejects.toThrow()
    })

    it('persists and reads back a valid document', async () => {
        const created = await Place.create({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false,
            headingParahg: 'example'
        })
        const found = await Place.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})
