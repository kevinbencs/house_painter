// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Admin from '@/models/Admin'


const { cookieSet, consume } = vi.hoisted(() => ({
  cookieSet: vi.fn(),
  consume: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ set: cookieSet })),
  headers: vi.fn(async () => ({ get: (k: string) => (k === 'x-forwarded-for' ? '1.2.3.4' : null) })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`) }),
}))
vi.mock('@/lib/rateLimit', () => ({ ipLimiter: { consume } }))
vi.mock('bcrypt', () => {
  const compare = vi.fn()
  return { default: { compare }, compare }
})
vi.mock('jsonwebtoken', () => {
  const sign = vi.fn(() => 'signed-2fa-token')
  return { default: { sign }, sign }
})

import { redirect } from 'next/navigation'
import bcrypt from 'bcrypt'
import { loginAction } from '@/action/login'

useTestDb()

function form(email = 'admin@test.com', password = 'correct-password') {
  const fd = new FormData()
  fd.set('email', email)
  fd.set('password', password)
  return fd
}
const prev = {} as any   

async function seedAdmin(twofa = 'SECRET') {
  return Admin.create({ email: 'admin@test.com', password: 'stored-hash', twofa })
}

beforeEach(() => {
  vi.stubEnv('JWT_SECRET_TWOFA', 'test-secret')
  consume.mockResolvedValue(undefined)             
  vi.mocked(bcrypt.compare).mockResolvedValue(true as any)  
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('loginAction', () => {
  it('blocks when the rate limiter rejects', async () => {
    consume.mockRejectedValue(new Error('limit'))   
    const res = await loginAction(prev, form())
    expect(res).toMatchObject({ error: 'Too many login attempts' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('returns validation messages for a bad email', async () => {
    const res = await loginAction(prev, form('not-an-email'))
    expect(res).toHaveProperty('failed')
  })

  it('returns a generic error when no admin matches', async () => {
    // DB empty
    const res = await loginAction(prev, form())
    expect(res).toMatchObject({ error: 'Invalid email or password' })
    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it('returns a generic error when the password is wrong', async () => {
    await seedAdmin()
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any)
    const res = await loginAction(prev, form())
    expect(res).toMatchObject({ error: 'Invalid email or password' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('sets the 2fa cookie and redirects to /login/2fa when 2fa is configured', async () => {
    await seedAdmin('SECRET')

    await expect(loginAction(prev, form())).rejects.toThrow('REDIRECT:/login/2fa')

    expect(cookieSet).toHaveBeenCalledWith(
      '2fa',
      'signed-2fa-token',
      expect.objectContaining({ httpOnly: true, maxAge: 600 }),
    )
    expect(redirect).toHaveBeenCalledWith('/login/2fa')
  })

  it('redirects to /new2fa when the admin has no 2fa secret', async () => {
    await seedAdmin('')  

    await expect(loginAction(prev, form())).rejects.toThrow('REDIRECT:/new2fa')
    expect(redirect).toHaveBeenCalledWith('/new2fa')
  })
})