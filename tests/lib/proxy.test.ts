// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const { cookieGet } = vi.hoisted(() => ({ cookieGet: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(async () => ({ get: cookieGet })) }))
vi.mock('jsonwebtoken', () => {
  const verify = vi.fn()
  return { default: { verify }, verify }
})

import jwt from 'jsonwebtoken'
import { middleware } from '@/lib/proxy'

const event = () => ({ waitUntil: vi.fn() }) as any
const req = (path: string) => new NextRequest(`http://localhost${path}`)
const expired = () => Object.assign(new Error('exp'), { name: 'TokenExpiredError' })

beforeEach(() => {
  vi.stubEnv('JWT_SECRET_Long', 'l')
  vi.stubEnv('JWT_SECRET_TWOFA', 't')
  vi.stubGlobal('fetch', vi.fn(async () => new Response('ok')))
  cookieGet.mockReturnValue(undefined)
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

describe('proxy middleware', () => {
  it('records analytics and passes through a public path', async () => {
    const ev = event()
    const res = await middleware(req('/'), ev)
    expect(res.headers.get('location')).toBeNull()          // NextResponse.next()
    expect(ev.waitUntil).toHaveBeenCalled()
    expect(fetch).toHaveBeenCalledWith('http://localhost/api/analytics',
      expect.objectContaining({ method: 'POST' }))
  })

  it('redirects /dashboard to / when the long token is missing', async () => {
    const res = await middleware(req('/dashboard'), event())
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toBe('http://localhost/')
  })

  it('lets /dashboard through when the long token verifies', async () => {
    cookieGet.mockReturnValue({ value: 'long' })
    vi.mocked(jwt.verify).mockReturnValue({ id: 'x' } as any)
    const res = await middleware(req('/dashboard'), event())
    expect(res.headers.get('location')).toBeNull()
  })

  it('redirects /dashboard to / when the token is expired', async () => {
    cookieGet.mockReturnValue({ value: 'long' })
    vi.mocked(jwt.verify).mockImplementation(() => { throw expired() })
    const res = await middleware(req('/dashboard'), event())
    expect(res.status).toBe(307)
  })

  it('redirects /login/2fa to / when the 2fa cookie is missing', async () => {
    const res = await middleware(req('/login/2fa'), event())
    expect(res.status).toBe(307)
  })

  // This one FAILS against the current code — it documents the fail-open bug below.
  it('redirects /dashboard on an unexpected verify error', async () => {
    cookieGet.mockReturnValue({ value: 'long' })
    vi.mocked(jwt.verify).mockImplementation(() => { throw new Error('boom') }) // name === 'Error'
    const res = await middleware(req('/dashboard'), event())
    expect(res.status).toBe(307)   // want a redirect; current code falls through to next() → lets them in
  })
})