import {describe, it, expect} from 'vitest'
import { NextRequest } from 'next/server'
import { useTestDb } from '../helper/vitest'
import {GET} from "@/app/api/img/route"


useTestDb()

const req = new NextRequest('http://localhost/api/img')

describe('GET /api/img',() => {
    it("return 200 when everything is good",async () => {
        const res = await GET(req);

        expect(res.status).toBe(200);
        const body = await res.json()
        expect(Array.isArray(body.success)).toBe(true)

    })


})