// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Blog from "@/models/Blog";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Blog model test', () => {
    it('rejects document missing heading', async () => {
        await expect(new Blog({
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing text', async () => {
        await expect(new Blog({
            heading: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing detail', async () => {
        await expect(new Blog({
            heading: 'example',
            text: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing keywords', async () => {
        await expect(new Blog({
            heading: 'example',
            text: 'example',
            detail: 'example',
            image: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing image', async () => {
        await expect(new Blog({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('rejects document string visibility', async () => {
        await expect(new Blog({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: 'efqw'
        }).save()).rejects.toThrow()
    })

    it('rejects document with duplicate heading', async () => {
        await Blog.create({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        })

        await expect(new Blog({
            heading: 'example',
            text: 'other',
            detail: 'other',
            keywords: 'other',
            image: 'other',
            visibility: false
        }).save()).rejects.toThrow()
    })

    it('persists and reads back a valid document', async () => {
        const created = await Blog.create({
            heading: 'example',
            text: 'example',
            detail: 'example',
            keywords: 'example',
            image: 'example',
            visibility: false
        })
        const found = await Blog.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})
