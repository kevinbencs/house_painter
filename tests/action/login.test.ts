// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Admin from '@/models/Admin'


const { cookieSet, cookieGet, cookieDelete, consume } = vi.hoisted(() => ({
  cookieSet: vi.fn(), cookieGet: vi.fn(), cookieDelete: vi.fn(), consume: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ set: cookieSet, get: cookieGet, delete: cookieDelete })),
  headers: vi.fn(async () => ({ get: (k: string) => (k === 'x-forwarded-for' ? '1.2.3.4' : null) })),
}))
vi.mock('next/navigation', () => ({ redirect: vi.fn((u: string) => { throw new Error(`REDIRECT:${u}`) }) }))
vi.mock('@/lib/session', () => ({
  encryptTwoFA: vi.fn(async () => 'signed-2fa'),
  decryptTwoFA: vi.fn(),
}))
vi.mock('@/lib/rateLimit', () => ({ ipLimiter: { consume } }))
vi.mock('otplib', () => ({ verify: vi.fn() }))
vi.mock('bcrypt', () => { const compare = vi.fn(); return { default: { compare }, compare } })

import bcrypt from 'bcrypt'
import { loginAction } from '@/action/login'

useTestDb()

const prev = {} as any
function form(email = 'admin@test.com', password = 'correct-password') {
  const fd = new FormData(); fd.set('email', email); fd.set('password', password); return fd
}
const seedAdmin = (twofa: string | undefined = 'SECRET') =>
  Admin.create({ email: 'admin@test.com', password: 'stored-hash', twofa })

beforeEach(() => {
  consume.mockResolvedValue(undefined)
  vi.mocked(bcrypt.compare).mockResolvedValue(true as any)
})
afterEach(() => vi.clearAllMocks())

describe('loginAction', () => {
  it('blocks when rate limited', async () => {
    consume.mockRejectedValue(new Error('limit'))
    expect(await loginAction(prev, form())).toMatchObject({ error: 'Too many login attempts' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('returns validation messages for a bad email', async () => {
    expect(await loginAction(prev, form('not-an-email'))).toHaveProperty('failed')
  })

  it('returns a generic error when no admin exists', async () => {
    expect(await loginAction(prev, form())).toMatchObject({ error: 'Invalid email or password' })
    expect(bcrypt.compare).not.toHaveBeenCalled()
  })

  it('returns a generic error when the password is wrong', async () => {
    await seedAdmin()
    vi.mocked(bcrypt.compare).mockResolvedValue(false as any)
    expect(await loginAction(prev, form())).toMatchObject({ error: 'Invalid email or password' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('sets the 2fa cookie and redirects to /login/2fa when 2fa is configured', async () => {
    await seedAdmin('SECRET')
    await expect(loginAction(prev, form())).rejects.toThrow('REDIRECT:/login/2fa')
    expect(cookieSet).toHaveBeenCalledWith('2fa', 'signed-2fa',
      expect.objectContaining({ httpOnly: true, maxAge: 600 }))
  })

  it('redirects to /new2fa when the admin has no 2fa secret', async () => {
    await seedAdmin(undefined)   // secret falsy → !secret branch
    await expect(loginAction(prev, form())).rejects.toThrow('REDIRECT:/new2fa')
    expect(cookieSet).toHaveBeenCalled()
  })
})