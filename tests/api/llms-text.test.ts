// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Blog from '@/models/Blog'
import Place from '@/models/Place'
import Service from '@/models/Service'

vi.mock('@/lib/data', () => ({ getNumbOfImagPage: vi.fn() }))
import { getNumbOfImagPage } from '@/lib/data'
import { GET } from '@/app/llms.txt/route'


useTestDb()

beforeEach(() => {
    vi.stubEnv('URL', 'example.com')
    vi.mocked(getNumbOfImagPage).mockResolvedValue(45)   // ceil(45/20) = 3 image pages
})
afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
})

async function seed() {

    await Blog.create({ heading: 'Első blog', detail: 'Blog leírás', text: 'x', image: 'i', keywords: 'k', visibility: true })
    await Blog.create({ heading: 'Második blog', detail: 'Másik leírás', text: 'x', image: 'i', keywords: 'k', visibility: true })
    await Service.create({ heading: 'Festés', detail: 'Szolgáltatás leírás', text: 'x', image: 'i', keywords: 'k', visibility: true })
    await Place.create({ heading: 'Budapest. kerület', detail: 'Hely leírás', text: 'x', image: 'i', keywords: 'k', visibility: true, headingParahg: "s" })
}

describe('GET /api/llms.txt', () => {
    it('returns markdown', async () => {
        await seed()
        const res = await GET()
        expect(res.headers.get('content-type')).toContain('text/markdown')
    })

    it('leaves no unresolved env vars in the output', async () => {
        await seed()
        const text = await (await GET()).text()
        expect(text).not.toContain('undefined')
        expect(text).toContain('https://example.com/')
    })

    it('puts each list entry on its own line', async () => {
        await seed()
        const text = await (await GET()).text()
        expect(text).not.toMatch(/,- \[/)
    })

    it('includes every seeded heading', async () => {
        await seed()
        const text = await (await GET()).text()
        for (const h of ['Első blog', 'Második blog', 'Festés']) {
            expect(text).toContain(h)
        }
    })

    it('paginates images by 20', async () => {
        await seed()
        const text = await (await GET()).text()
        const pages = text.match(/\/kepek\/\d+/g) ?? []
        expect(pages).toHaveLength(3)
    })
})