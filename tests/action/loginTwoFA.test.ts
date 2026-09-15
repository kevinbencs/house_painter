// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
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
  encryptTwoFA: vi.fn(async () => 'signed-auth'),
}))
vi.mock('@/lib/rateLimit', () => ({ ipLimiter: { consume: vi.fn() } }))
vi.mock('otplib', () => ({ verify: vi.fn() }))
vi.mock('bcrypt', () => { const compare = vi.fn(); return { default: { compare }, compare } })

import { decryptTwoFA } from '@/lib/session'
import { verify as otpVerify } from 'otplib'
import { loginTwoFAAction } from '@/action/login'

useTestDb()

const prev = {} as any
function form(otp = '123456') { const fd = new FormData(); fd.set('optName', otp); return fd }
const seedAdmin = (twofa = 'BASE32SECRET') => Admin.create({ email: 'a@test.com', password: 'h', twofa })

beforeEach(() => cookieGet.mockReturnValue({ value: 'a-2fa-cookie' }))   // cookie present
afterEach(() => vi.clearAllMocks())

describe('loginTwoFAAction', () => {
  it('redirects to / when the 2fa cookie is missing', async () => {
    cookieGet.mockReturnValue(undefined)
    await expect(loginTwoFAAction(prev, form())).rejects.toThrow('REDIRECT:/')
  })

  it('redirects to / when the admin does not exist', async () => {
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: new mongoose.Types.ObjectId().toString() } as any)
    await expect(loginTwoFAAction(prev, form())).rejects.toThrow('REDIRECT:/')
    expect(cookieSet).not.toHaveBeenCalled()
  })

  it('returns validation messages for a malformed otp', async () => {
    const admin = await seedAdmin()
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: admin._id.toString() } as any)
    expect(await loginTwoFAAction(prev, form('bad'))).toHaveProperty('failed')
  })

  it('sets AuthToken and redirects to /dashboard on a valid otp', async () => {
    const admin = await seedAdmin('BASE32SECRET')
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: admin._id.toString() } as any)
    vi.mocked(otpVerify).mockResolvedValue({ valid: true } as any)

    await expect(loginTwoFAAction(prev, form('123456'))).rejects.toThrow('REDIRECT:/dashboard')
    expect(cookieDelete).toHaveBeenCalledWith('2fa')
    expect(cookieSet).toHaveBeenCalledWith('AuthToken', 'signed-auth',
      expect.objectContaining({ httpOnly: true, maxAge: 3600 }))
  })

  it('returns an error on an invalid otp', async () => {
    const admin = await seedAdmin('BASE32SECRET')
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: admin._id.toString() } as any)
    vi.mocked(otpVerify).mockResolvedValue({ valid: false } as any)

    expect(await loginTwoFAAction(prev, form('123456'))).toMatchObject({ error: 'Hiba, próbáld újra.' })
    expect(cookieSet).not.toHaveBeenCalled()
  })

  // Documents a bug — see below. Passes against current code; change it once you fix the action.
  it('BUG: the otp===secret reset path does not short-circuit', async () => {
    const admin = await seedAdmin('123456')                 // secret equals otp AND passes otpTokenSchema2
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: admin._id.toString() } as any)
    vi.mocked(otpVerify).mockResolvedValue({ valid: false } as any)  // the raw secret isn't a valid TOTP code

    const res = await loginTwoFAAction(prev, form('123456'))

    const fresh = await Admin.findById(admin._id)
    expect(fresh?.twofa).toBe('')                            // twofa WAS reset in the DB...
    expect(res).toMatchObject({ error: 'Hiba, próbáld újra.' })  // ...but user sees an error, not /new2fa
  })
})