// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Image from "@/models/Image";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Image model test', () => {
    it('rejects document missing blobUrl', async () => {
        await expect(new Image({
            newUrl: '/example',
            detail: 'example',
            show: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing newUrl', async () => {
        await expect(new Image({
            blobUrl: '/example',
            detail: 'example',
            show: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing detail', async () => {
        await expect(new Image({
            newUrl: '/example',
            blobUrl: 'example',
            show: false
        }).save()).rejects.toThrow()
    })

    it('rejects document string show', async () => {
        await expect(new Image({
            newUrl: '/example',
            detail: 'example',
            blobUrl: '/example',
            show: 'efqw'
        }).save()).rejects.toThrow()
    })

    it('persists and reads back a valid document', async () => {
        const created = await Image.create({ 
            newUrl: '/example',
            detail: 'example',
            blobUrl: '/example',
            show: false
        })
        const found = await Image.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})