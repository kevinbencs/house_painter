// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest' 
import Admin from '@/models/Admin'

const { cookieGet, cookieSet, cookieDelete } = vi.hoisted(() => ({
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
  cookieDelete: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGet, set: cookieSet, delete: cookieDelete })),
  headers: vi.fn(async () => ({ get: () => null })),
}))
vi.mock('jsonwebtoken', () => {
  const verify = vi.fn()
  const sign = vi.fn(() => 'signed-token')
  return { default: { verify, sign }, verify, sign }
})
vi.mock('otplib', () => ({ verify: vi.fn() }))

import jwt from 'jsonwebtoken'
import { verify as otpVerify } from 'otplib'
import { loginTwoFAAction } from '@/action/login'

useTestDb()

async function seedAdmin(twofa = 'BASE32SECRET') {
  return Admin.create({ email: 'admin@test.com', password: 'hash', twofa })
}

beforeEach(() => {
  vi.stubEnv('JWT_SECRET_URL', 's')
  vi.stubEnv('JWT_SECRET_Long', 's')
  vi.stubEnv('JWT_SECRET_Short', 's')
  cookieGet.mockReturnValue({ value: 'a-2fa-cookie' })   
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('loginTwoFAAction', () => {
  it('redirects to /login when the 2fa cookie is missing', async () => {
    cookieGet.mockReturnValue(undefined)
    expect(await loginTwoFAAction('123456')).toEqual({ redirect: '/login' })
  })

  it('redirects to /login when the jwt is expired', async () => {
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw Object.assign(new Error('exp'), { name: 'TokenExpiredError' })
    })
    expect(await loginTwoFAAction('123456')).toEqual({ redirect: '/login' })
  })

  it('redirects to /login when the admin no longer exists', async () => {
    vi.mocked(jwt.verify).mockReturnValue({ id: new mongoose.Types.ObjectId().toString() } as any)
    expect(await loginTwoFAAction('123456')).toEqual({ redirect: '/login' })
  })

  it('returns validation messages for a malformed otp', async () => {
    const admin = await seedAdmin()
    vi.mocked(jwt.verify).mockReturnValue({ id: admin._id.toString() } as any)
    const res = await loginTwoFAAction('bad')  
    expect(res).toHaveProperty('failed')
  })

  it('resets twofa and redirects to /new2fa when otp equals the stored secret', async () => {
    const admin = await seedAdmin('123456')     
    vi.mocked(jwt.verify).mockReturnValue({ id: admin._id.toString() } as any)

    const res = await loginTwoFAAction('123456')

    expect(res).toEqual({ redirect: '/new2fa' })
    const fresh = await Admin.findById(admin._id)
    expect(fresh?.twofa).toBe('')               
  })

  it('sets auth cookies and redirects to /dashboard on a valid otp', async () => {
    const admin = await seedAdmin('BASE32SECRET')
    vi.mocked(jwt.verify).mockReturnValue({ id: admin._id.toString() } as any)
    vi.mocked(otpVerify).mockResolvedValue({ valid: true } as any)

    const res = await loginTwoFAAction('123456')

    expect(res).toEqual({ redirect: '/dashboard' })
    expect(cookieDelete).toHaveBeenCalledWith('2fa')
    expect(cookieSet).toHaveBeenCalledWith('longAuthToken', 'signed-token',
      expect.objectContaining({ httpOnly: true, maxAge: 3600 }))
    expect(cookieSet).toHaveBeenCalledWith('shortAuthToken', 'signed-token',
      expect.objectContaining({ maxAge: 300 }))
  })

  it('returns an error on an invalid otp', async () => {
    const admin = await seedAdmin('BASE32SECRET')
    vi.mocked(jwt.verify).mockReturnValue({ id: admin._id.toString() } as any)
    vi.mocked(otpVerify).mockResolvedValue({ valid: false } as any)

    expect(await loginTwoFAAction('123456')).toEqual({ error: 'Hiba, próbáld újra.' })
  })
})