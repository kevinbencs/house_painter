// @vitest-environment node

import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Image from '@/models/Image'
import { GET } from '@/app/api/images/id/[id]/route'

useTestDb()

const req = () => new NextRequest('http://localhost/api/images/id/123')
const ctx = (id: string) => ({ params: Promise.resolve({ id }) })

describe('GET /api/images/id/[id]', () => {
    it('returns 404 when no image matches the id', async () => {
        const id = new mongoose.Types.ObjectId().toString()
        const res = await GET(req(), ctx(id))

        expect(res.status).toBe(404)
        expect(await res.json()).toEqual({ error: 'Nincs ilyen kép' })
    })

    it('returns 200 with the image when found', async () => {
        const created = await Image.create({
            newUrl: 'pic-1',
            blobUrl: 'https://blob/xyz',
            detail: 'a cat',
            show: false
        })

        const res = await GET(req(), ctx(created._id.toString()))

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.success._id).toBe(created._id.toString())
        expect(body.success.newUrl).toBe('pic-1')
    })

    it('returns 500 when the id is not a valid ObjectId', async () => {
        const res = await GET(req(), ctx('not-a-valid-id'))

        expect(res.status).toBe(500)
        expect(await res.json()).toEqual({ error: 'Server error' })
    })

    it('returns 500 when the lookup throws unexpectedly', async () => {
        vi.spyOn(Image, 'findById').mockRejectedValueOnce(new Error('boom'))

        const id = new mongoose.Types.ObjectId().toString()
        const res = await GET(req(), ctx(id))

        expect(res.status).toBe(500)
        expect(await res.json()).toEqual({ error: 'Server error' })

        vi.restoreAllMocks()
    })
})
