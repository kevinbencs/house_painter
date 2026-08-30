import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server"
import { GET } from "@/app/api/isLoggedIn/route"

vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
import { checkAuth } from "@/lib/checkAuth"


const req = new NextRequest('http://localhost/api/isLoggedIn')

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
})
afterEach(() => {
    vi.clearAllMocks()
})

describe("GET /api/isLoggedIn", () => {
    it("rejects an unauthenticated caller", async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const res = await GET(req)

        expect(res.status).toBe(401)
        const body = await res.json()
        expect(body.error).toBe("Kérlek jelentkezz be.")
    })

    it("return 200 when everything works", async () => {
        const res = await GET(req)

        expect(res.status).toBe(200)
        const body = await res.json()
        expect(body.success).toBe("Be vagy jelentkezve")
    })
})