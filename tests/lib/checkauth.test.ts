// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest' 
import Admin from '@/models/Admin'

const { cookieGet } = vi.hoisted(() => ({ cookieGet: vi.fn() }))
vi.mock('next/headers', () => ({ cookies: vi.fn(async () => ({ get: cookieGet })) }))
vi.mock('@/lib/session', () => ({
  decrypt: vi.fn(),
  decryptTwoFA: vi.fn(),
  decryptURL: vi.fn(),
}))

import { decrypt, decryptTwoFA, decryptURL } from '@/lib/session'
import { checkAuth, checkNewPassPageUlr, checkTwoFAToken } from '@/lib/checkAuth'

useTestDb()  // only checkTwoFAToken needs it, but harmless for the file

// cookie.get(name) → { value } or undefined
const setCookie = (name: string, value?: string) =>
  cookieGet.mockImplementation((n: string) => (n === name && value ? { value } : undefined))

beforeEach(() => cookieGet.mockReturnValue(undefined))
afterEach(() => vi.clearAllMocks())

describe('checkAuth', () => {
  it('errors when the AuthToken cookie is missing', async () => {
    expect(await checkAuth()).toEqual({ error: ' Error' })   // note the leading space
    expect(decrypt).not.toHaveBeenCalled()
  })

  it('returns the id when the token decrypts to a payload with an id', async () => {
    setCookie('AuthToken', 'a-token')
    vi.mocked(decrypt).mockResolvedValue({ id: 'admin-1' } as any)
    expect(await checkAuth()).toEqual({ res: 'admin-1' })
    expect(decrypt).toHaveBeenCalledWith('a-token')
  })

  it('errors when decrypt fails (returns undefined)', async () => {
    setCookie('AuthToken', 'bad-token')
    vi.mocked(decrypt).mockResolvedValue(undefined as any)
    expect(await checkAuth()).toEqual({ error: 'Error' })
  })

  it('errors when the payload has no id', async () => {
    setCookie('AuthToken', 'weird-token')
    vi.mocked(decrypt).mockResolvedValue({ foo: 'bar' } as any)
    expect(await checkAuth()).toEqual({ error: 'Error' })
  })
})

describe('checkNewPassPageUlr', () => {
  it('returns the id for a valid reset url', async () => {
    vi.mocked(decryptURL).mockResolvedValue({ id: 'admin-2' } as any)
    expect(await checkNewPassPageUlr('some-url')).toEqual({ res: 'admin-2' })
    expect(decryptURL).toHaveBeenCalledWith('some-url')
  })

  it('errors for an invalid reset url', async () => {
    vi.mocked(decryptURL).mockResolvedValue(undefined as any)
    expect(await checkNewPassPageUlr('bad')).toEqual({ error: 'Error' })
  })
})

describe('checkTwoFAToken', () => {
  it('errors when the 2fa cookie is missing', async () => {
    expect(await checkTwoFAToken()).toEqual({ error: 'There is no token' })
    expect(decryptTwoFA).not.toHaveBeenCalled()
  })

  it('errors when the token decrypts to nothing', async () => {
    setCookie('2fa', 'tok')
    vi.mocked(decryptTwoFA).mockResolvedValue(undefined as any)
    expect(await checkTwoFAToken()).toEqual({ error: ' Error' })
  })

  it('errors when the admin no longer exists', async () => {
    setCookie('2fa', 'tok')
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: new mongoose.Types.ObjectId().toString() } as any)
    expect(await checkTwoFAToken()).toEqual({ error: 'There is no admin with this id' })
  })

  it('returns id and twofa when the admin exists', async () => {
    const admin = await Admin.create({ email: 'a@test.com', password: 'h', twofa: 'SECRET' })
    setCookie('2fa', 'tok')
    vi.mocked(decryptTwoFA).mockResolvedValue({ id: admin._id.toString() } as any)

    expect(await checkTwoFAToken()).toEqual({ res: admin._id.toString(), twofa: 'SECRET' })
  })
})