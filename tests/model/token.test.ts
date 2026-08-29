// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Token from "@/models/Token";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Token model test', () => {
    it('rejects document missing token', async () => {
        await expect(new Token({
            usage: false
        }).save()).rejects.toThrow()
    })

    it('rejects document missing usage', async () => {
        await expect(new Token({
            token: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document string usage', async () => {
        await expect(new Token({
            token: 'example',
            usage: 'efqw'
        }).save()).rejects.toThrow()
    })

    it('persists and reads back a valid document', async () => {
        const created = await Token.create({
            token: 'example',
            usage: false
        })
        const found = await Token.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
        expect(found?.token).toBe('example')
        expect(found?.usage).toBe(false)
    })
})
