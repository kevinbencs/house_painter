// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest' 
import Admin from '@/models/Admin'

const { cookieGet, cookieSet } = vi.hoisted(() => ({
  cookieGet: vi.fn(),
  cookieSet: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGet, set: cookieSet })),
}))
vi.mock('jsonwebtoken', () => {
  const verify = vi.fn()
  const sign = vi.fn(() => 'new-short-token')
  return { default: { verify, sign }, verify, sign }
})

import jwt from 'jsonwebtoken'
import { checkAuth } from '@/lib/checkAuth'

useTestDb()

// helpers to express intent per token
const expired = () => Object.assign(new Error('exp'), { name: 'TokenExpiredError' })
const cookiesPresent = (short?: string, long?: string) => {
  cookieGet.mockImplementation((name: string) => {
    if (name === 'shortAuthToken') return short ? { value: short } : undefined
    if (name === 'longAuthToken') return long ? { value: long } : undefined
    return undefined
  })
}

beforeEach(() => {
  vi.stubEnv('JWT_SECRET_Short', 's')
  vi.stubEnv('JWT_SECRET_Long', 'l')
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('checkAuth', () => {
  it('errors when no token is present', async () => {
    cookiesPresent(undefined, undefined)
    expect(await checkAuth()).toEqual({ error: 'There is no token' })
  })

  it('succeeds on a valid access token WITHOUT touching the DB', async () => {
    cookiesPresent('short', undefined)
    vi.mocked(jwt.verify).mockReturnValue({ id: 'admin-123' } as any)  // access path

    const res = await checkAuth()

    expect(res).toEqual({ success: 'admin-123' })
    expect(cookieSet).not.toHaveBeenCalled()   // no rotation on the happy path
    // note: no Admin seeded, and it still works — that's the stateless access path
  })

  it('rotates a new short token when access is expired but refresh is valid', async () => {
    const admin = await Admin.create({ email: 'a@test.com', password: 'h' })
    cookiesPresent('short', 'long')
    vi.mocked(jwt.verify)
      .mockImplementationOnce(() => { throw expired() })          // access → expired
      .mockReturnValueOnce({ id: admin._id.toString() } as any)   // refresh → valid

    const res = await checkAuth()

    expect(res).toEqual({ success: admin._id.toString() })
    expect(cookieSet).toHaveBeenCalledWith('shortAuthToken', 'new-short-token',
      expect.objectContaining({ httpOnly: true, maxAge: 300 }))
  })

  it('errors when access is expired and the refresh admin no longer exists', async () => {
    cookiesPresent('short', 'long')
    vi.mocked(jwt.verify)
      .mockImplementationOnce(() => { throw expired() })                          // access
      .mockReturnValueOnce({ id: new mongoose.Types.ObjectId().toString() } as any) // refresh id, but no admin

    const res = await checkAuth()

    expect(res).toEqual({ error: 'There is no admin with this id' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('errors when access is expired and there is no refresh token', async () => {
    cookiesPresent('short', undefined)
    vi.mocked(jwt.verify).mockImplementationOnce(() => { throw expired() })

    expect(await checkAuth()).toEqual({ error: 'JWT error' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('rotates from a valid refresh token when only the long token is present', async () => {
    const admin = await Admin.create({ email: 'b@test.com', password: 'h' })
    cookiesPresent(undefined, 'long')
    vi.mocked(jwt.verify).mockReturnValue({ id: admin._id.toString() } as any)   // refresh path

    const res = await checkAuth()

    expect(res).toEqual({ success: admin._id.toString() })
    expect(cookieSet).toHaveBeenCalledWith('shortAuthToken', 'new-short-token',
      expect.objectContaining({ maxAge: 300 }))
  })
})