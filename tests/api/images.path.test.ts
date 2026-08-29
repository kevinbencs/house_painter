// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { useTestDb } from '../helper/vitest'
import Image from '@/models/Image'

// Mock the external service. vi.mock is hoisted above the imports below.
vi.mock('@vercel/blob', () => ({ get: vi.fn() }))
import { get } from '@vercel/blob'
import { GET } from '@/app/api/images/[path]/route'


useTestDb()

const req = () => new NextRequest('http://localhost/api/images/pic-1')
const ctx = (path: string) => ({ params: Promise.resolve({ path }) })

beforeEach(() => {
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token')
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('GET /api/images/[path]', () => {
  it('returns 500 when the blob token is missing', async () => {
    vi.stubEnv('BLOB_READ_WRITE_TOKEN', undefined) 
    const res = await GET(req(), ctx('pic-1'))
    expect(res.status).toBe(500)
  })

  it('returns 404 when no image matches the path', async () => {
    const res = await GET(req(), ctx('nope'))    // DB is empty
    expect(res.status).toBe(404)
    expect(vi.mocked(get)).not.toHaveBeenCalled()
  })

  it('streams the blob with correct headers when found', async () => {
    await Image.create({ blobUrl: 'https://blob/xyz', newUrl: 'pic-1', detail: 'a cat' })
    vi.mocked(get).mockResolvedValue({
      statusCode: 200,
      stream: 'binary-bytes',                    
      blob: { contentType: 'image/png' },
    } as any)

    const res = await GET(req(), ctx('pic-1'))

    expect(res.status).toBe(200)
    expect(res.headers.get('content-type')).toBe('image/png')
    expect(res.headers.get('cache-control')).toContain('immutable')
    expect(vi.mocked(get)).toHaveBeenCalledWith(
      'https://blob/xyz',
      expect.objectContaining({ token: 'test-token' }),
    )
  })

  it('returns 404 when the blob lookup is not 200', async () => {
    await Image.create({ blobUrl: 'https://blob/xyz', newUrl: 'pic-1', detail: 'a cat' })
    vi.mocked(get).mockResolvedValue({ statusCode: 403 } as any)
    const res = await GET(req(), ctx('pic-1'))
    expect(res.status).toBe(404)
  })

  it('returns 500 when the blob call throws', async () => {
    await Image.create({ blobUrl: 'https://blob/xyz', newUrl: 'pic-1', detail: 'a cat' })
    vi.mocked(get).mockRejectedValue(new Error('network'))
    const res = await GET(req(), ctx('pic-1'))
    expect(res.status).toBe(500)
    expect(await res.json()).toEqual({ error: 'Server error' })
  })
})