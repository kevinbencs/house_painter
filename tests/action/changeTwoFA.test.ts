// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Admin from '@/models/Admin'

const { cookieGet, cookieSet, cookieDelete } = vi.hoisted(() => ({
  cookieGet: vi.fn(), cookieSet: vi.fn(), cookieDelete: vi.fn(),
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ get: cookieGet, set: cookieSet, delete: cookieDelete })),
}))
vi.mock('next/navigation', () => ({ redirect: vi.fn((u: string) => { throw new Error(`REDIRECT:${u}`) }) }))
vi.mock('@/lib/session', () => ({
  decryptTwoFA: vi.fn(),
  encryptJWT: vi.fn(async () => 'signed-auth'),
}))
vi.mock('otplib', () => ({ verify: vi.fn() }))

import { decryptTwoFA, encryptJWT } from '@/lib/session'
import { verify as otpVerify } from 'otplib'
import { setNewTwoFA } from '@/action/change2FA'

useTestDb()

const SECRET = 'BASE32SECRET'
const seedAdmin = (overrides = {}) =>
  Admin.create({ email: 'admin@test.com', password: 'hash', ...overrides })

beforeEach(() => {
  cookieGet.mockReturnValue({ value: 'a-2fa-cookie' })   // 2fa cookie present
  vi.mocked(otpVerify).mockResolvedValue({ valid: true } as any)
  vi.spyOn(console, 'log').mockImplementation(() => { })
  vi.spyOn(console, 'error').mockImplementation(() => { })
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

describe('setNewTwoFA', () => {
  it('redirects to / when the 2fa cookie is missing', async () => {
    cookieGet.mockReturnValue(undefined)

    await expect(setNewTwoFA('123456', SECRET)).rejects.toThrow('REDIRECT:/')
    expect(decryptTwoFA).not.toHaveBeenCalled()
    expect(otpVerify).not.toHaveBeenCalled()
  })

  it('redirects to / when the 2fa token does not belong to an admin', async () => {
    await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue(undefined)   // token failed to verify

    await expect(setNewTwoFA('123456', SECRET)).rejects.toThrow('REDIRECT:/')
    expect(otpVerify).not.toHaveBeenCalled()
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('redirects to / when the admin id in the token does not exist', async () => {
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: '507f1f77bcf86cd799439011' } as any)

    await expect(setNewTwoFA('123456', SECRET)).rejects.toThrow('REDIRECT:/')
    expect(otpVerify).not.toHaveBeenCalled()
  })

  it('returns validation messages for a code that is not 6 characters', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)

    const res = await setNewTwoFA('123', SECRET)

    expect(res).toHaveProperty('failed')
    expect(res?.failed).toHaveLength(1)
    expect(otpVerify).not.toHaveBeenCalled()
    expect((await Admin.findById(admin._id))?.twofa).toBeUndefined()
  })

  it('returns validation messages for an empty code', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)

    const res = await setNewTwoFA('', SECRET)

    expect(res?.failed).toContain('A Kód megadása kötelező')
    expect(otpVerify).not.toHaveBeenCalled()
  })

  it('returns a validation message for an empty secret', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)

    const res = await setNewTwoFA('123456', '')

    // the schema chains .min(1) twice; the second one has no custom message
    expect(res).toEqual({
      failed: ['A secret megadása kötelező', 'Too small: expected string to have >=1 characters'],
    })
    expect(otpVerify).not.toHaveBeenCalled()
  })

  it('returns an error and changes nothing when the code is wrong', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)
    vi.mocked(otpVerify).mockResolvedValue({ valid: false } as any)

    const res = await setNewTwoFA('123456', SECRET)

    expect(res).toEqual({ error: 'Hiba, próbáld újra.' })
    expect(otpVerify).toHaveBeenCalledWith({ secret: SECRET, token: '123456' })
    expect((await Admin.findById(admin._id))?.twofa).toBeUndefined()
    expect(cookieDelete).not.toHaveBeenCalled()
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('saves the secret, swaps the cookies and redirects to /dashboard on success', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)

    await expect(setNewTwoFA('123456', SECRET)).rejects.toThrow('REDIRECT:/dashboard')

    expect(decryptTwoFA).toHaveBeenCalledWith('a-2fa-cookie')
    expect(otpVerify).toHaveBeenCalledWith({ secret: SECRET, token: '123456' })
    expect((await Admin.findById(admin._id))?.twofa).toBe(SECRET)
    expect(cookieDelete).toHaveBeenCalledWith('2fa')
    expect(encryptJWT).toHaveBeenCalledWith(expect.objectContaining({ expiresAt: expect.any(Date) }))
  })

  it('only updates the admin named in the token', async () => {
    const admin = await seedAdmin()
    const other = await seedAdmin({ email: 'other@test.com' })
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)

    await expect(setNewTwoFA('123456', SECRET)).rejects.toThrow('REDIRECT:/dashboard')

    expect((await Admin.findById(other._id))?.twofa).toBeUndefined()
  })

  // The cookie API is cookieStore.set(name, value, options).
  it('sets the AuthToken cookie to the signed JWT', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)

    await expect(setNewTwoFA('123456', SECRET)).rejects.toThrow('REDIRECT:/dashboard')

    expect(cookieSet).toHaveBeenCalledWith('AuthToken', 'signed-auth',
      expect.objectContaining({ httpOnly: true, secure: true, maxAge: 3600 }))
  })

  it('returns a server error when the database call fails', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: String(admin._id) } as any)
    vi.spyOn(Admin, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('boom'))

    const res = await setNewTwoFA('123456', SECRET)

    expect(res).toEqual({ error: 'Server error' })
    expect(cookieSet).not.toHaveBeenCalled()
  })
})
