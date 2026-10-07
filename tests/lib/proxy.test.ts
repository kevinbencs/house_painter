// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const { cookieGet } = vi.hoisted(() => ({ cookieGet: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(async () => ({ get: cookieGet })) }))
vi.mock('@/lib/session', () => ({
  decrypt: vi.fn(),
  decryptTwoFA: vi.fn(),
  decryptURL: vi.fn(),
}))

import { decrypt, decryptTwoFA } from '@/lib/session'
import { middleware } from '@/lib/proxy'

const event = () => ({ waitUntil: vi.fn() }) as any
const req = (path: string) => new NextRequest(`http://localhost${path}`)

// cookie.get(name) → { value } or undefined
const setCookies = (cookies: Record<string, string>) =>
  cookieGet.mockImplementation((n: string) => (n in cookies ? { value: cookies[n] } : undefined))

const expectPassThrough = (res: Response) => {
  expect(res.status).toBe(200)
  expect(res.headers.get('location')).toBeNull()   // NextResponse.next()
}
const expectRedirectHome = (res: Response) => {
  expect(res.status).toBe(307)
  expect(res.headers.get('location')).toBe('http://localhost/')
}

beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn(async () => new Response('ok')))
  vi.spyOn(console, 'log').mockImplementation(() => { })
  cookieGet.mockReturnValue(undefined)
  // jose's jwtVerify failures are swallowed by decrypt(), which returns undefined
  vi.mocked(decrypt).mockResolvedValue(undefined)
  vi.mocked(decryptTwoFA).mockResolvedValue(undefined)
})
afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('proxy middleware', () => {
  it('records analytics and passes through a public path', async () => {
    const ev = event()
    const res = await middleware(req('/blog'), ev)

    expectPassThrough(res)
    expect(ev.waitUntil).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ pathname: '/blog', referrer: null }),
    })
  })

  it('records analytics even when the request is redirected', async () => {
    const ev = event()
    const res = await middleware(req('/dashboard'), ev)

    expectRedirectHome(res)
    expect(ev.waitUntil).toHaveBeenCalledTimes(1)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it('does not require a login for a public path', async () => {
    const res = await middleware(req('/'), event())

    expectPassThrough(res)
  })

  describe('/dashboard', () => {
    it('redirects to / when the AuthToken cookie is missing', async () => {
      expectRedirectHome(await middleware(req('/dashboard'), event()))
      expect(decrypt).not.toHaveBeenCalled()
    })

    it('redirects to / when the token fails to verify (invalid or expired)', async () => {
      setCookies({ AuthToken: 'bad-token' })

      expectRedirectHome(await middleware(req('/dashboard'), event()))
      expect(decrypt).toHaveBeenCalledWith('bad-token')
    })

    it('redirects to / when the verified token has no id', async () => {
      setCookies({ AuthToken: 'no-id' })
      vi.mocked(decrypt).mockResolvedValue({ foo: 'bar' } as any)

      expectRedirectHome(await middleware(req('/dashboard'), event()))
    })

    it('lets the request through when the token verifies', async () => {
      setCookies({ AuthToken: 'good-token' })
      vi.mocked(decrypt).mockResolvedValue({ id: 'admin-1' } as any)

      expectPassThrough(await middleware(req('/dashboard'), event()))
      expect(decrypt).toHaveBeenCalledWith('good-token')
    })

    it('protects nested dashboard paths too', async () => {
      expectRedirectHome(await middleware(req('/dashboard/blog/new'), event()))
    })

    it('ignores a valid 2fa cookie when the AuthToken is missing', async () => {
      setCookies({ '2fa': 'good-2fa' })
      vi.mocked(decryptTwoFA).mockResolvedValue({ id: 'admin-1' } as any)

      expectRedirectHome(await middleware(req('/dashboard'), event()))
    })
  })

  describe.each(['/login/2fa', '/new2fa'])('%s', (path) => {
    it('redirects to / when the 2fa cookie is missing', async () => {
      expectRedirectHome(await middleware(req(path), event()))
      expect(decryptTwoFA).not.toHaveBeenCalled()
    })

    it('redirects to / when the 2fa cookie is empty', async () => {
      setCookies({ '2fa': '' })

      expectRedirectHome(await middleware(req(path), event()))
    })

    it('redirects to / when the 2fa token fails to verify', async () => {
      setCookies({ '2fa': 'bad-2fa' })

      expectRedirectHome(await middleware(req(path), event()))
      expect(decryptTwoFA).toHaveBeenCalledWith('bad-2fa')
    })

    it('redirects to / when the verified 2fa token has no id', async () => {
      setCookies({ '2fa': 'no-id' })
      vi.mocked(decryptTwoFA).mockResolvedValue({ foo: 'bar' } as any)

      expectRedirectHome(await middleware(req(path), event()))
    })

    it('lets the request through when the 2fa token verifies', async () => {
      setCookies({ '2fa': 'good-2fa' })
      vi.mocked(decryptTwoFA).mockResolvedValue({ id: 'admin-1' } as any)

      expectPassThrough(await middleware(req(path), event()))
    })

    it('ignores a valid AuthToken when the 2fa cookie is missing', async () => {
      setCookies({ AuthToken: 'good-token' })
      vi.mocked(decrypt).mockResolvedValue({ id: 'admin-1' } as any)

      expectRedirectHome(await middleware(req(path), event()))
    })
  })
})
