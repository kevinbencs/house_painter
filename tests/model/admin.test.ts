// @vitest-environment node

import { useTestDb } from "../helper/vitest";
import Admin from "@/models/Admin";
import { describe, it, expect } from 'vitest'

useTestDb()

describe('Admin model test', () => {
    it('rejects document missing password', async () => {
        await expect(new Admin({
            email: 'example@example.com',
            twofa: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing email', async () => {
        await expect(new Admin({
            password: 'example',
            twofa: 'example'
        }).save()).rejects.toThrow()
    })

    it('rejects document missing twofa', async () => {
        await expect(new Admin({
            password: 'example',
            email: 'example@example.com'
        }).save()).rejects.toThrow()
    })

    it('rejects document with duplicate email', async () => {
        await Admin.create({
            password: 'example',
            email: 'example@example.com',
            twofa: 'example'
        })

        await expect(new Admin({
            password: 'other',
            email: 'example@example.com',
            twofa: 'other'
        }).save()).rejects.toThrow()
    })

    it('lowercases and trims the email', async () => {
        const created = await Admin.create({
            password: 'example',
            email: '  Example@Example.com  ',
            twofa: 'example'
        })
        expect(created.email).toBe('example@example.com')
    })

    it('persists and reads back a valid document', async () => {
        const created = await Admin.create({
            password: 'example',
            email: 'example@example.com',
            twofa: 'example'
        })
        const found = await Admin.findById(created._id)
        expect(found?._id.toString()).toBe(created._id.toString())
    })
})
