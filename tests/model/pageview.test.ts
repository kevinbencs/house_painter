// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import PageView from "@/models/PageView";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('PageView model test', () => {
    it('rejects document missing pathname', async () => {
        await expect(new PageView({
            referrer: 'example'
        }).save()).rejects.toThrow()
    })

    it('persists a document without referrer using default null', async () => {
        const created = await PageView.create({
            pathname: '/example'
        })
        expect(created.referrer).toBeNull()
    })

    it('persists and reads back a valid document', async () => {
        const created = await PageView.create({
            pathname: '/example',
            referrer: 'https://example.com'
        })
        const found = await PageView.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})
