// @vitest-environment node

import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { useTestDb } from '../helper/vitest'
import { POST } from '@/app/api/analytics/route'
import PageView from '@/models/PageView'

useTestDb()

const postRequest = (body: unknown, raw?: string) => {
    return new NextRequest('http://localhost/api/analytics', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: raw ?? JSON.stringify(body)
    })
}



describe('Test POST /api/analytics', () => {
    it('saves a page view and returns 200 for a valid body', async () => {
        const res = await POST(postRequest({ pathname: '/home', referrer: null }))

        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({ message: "success" })

        const docs = await PageView.find();
        expect(docs).toHaveLength(1);
        expect(docs[0].pathname).toBe('/home')
    })

    it('returns 400 with the validation messages for a bad body', async () => {
        const res = await POST(postRequest({ referrer: null }))

        expect(res.status).toBe(400)
        const body = await res.json()
        expect(Array.isArray(body.failed)).toBe(true)

        expect(await PageView.countDocuments()).toBe(0)
    })

    it('returns 500 when the body is not valid JSON', async () => {
        const res = await POST(postRequest(null, 'not json'))

        expect(res.status).toBe(500)

        expect(await res.json()).toEqual({ error: 'Server error' })

        expect(await PageView.countDocuments()).toBe(0)
    })

    it('returns 500 on duplicate-key error', async () => {
        vi.spyOn(PageView.prototype, 'save').mockRejectedValueOnce(
            Object.assign(new Error('dup'), { code: 11000, keyValue: { pathname: '/home' } })
        )

        const res = await POST(postRequest({ pathname: '/home', referrer: null }))

        expect(res.status).toBe(500);
        expect((await res.json()).error).toContain('already exists')

        vi.restoreAllMocks()
    })
})