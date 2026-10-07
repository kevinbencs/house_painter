// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest'
import Admin from '@/models/Admin'

const { send } = vi.hoisted(() => ({ send: vi.fn() }))

vi.mock('resend', () => ({
    Resend: class {
        emails = { send }
    },
}))
vi.mock('@/lib/session', () => ({ encryptTwoFA: vi.fn(async () => 'signed-token') }))
vi.mock('@/lib/checkAuth', () => ({
    checkAuth: vi.fn(),
    checkNewPassPageUlr: vi.fn(),
}))

import { checkAuth, checkNewPassPageUlr } from '@/lib/checkAuth'
import { encryptTwoFA } from '@/lib/session'
import { sendEmail, changePassword } from '@/action/newpassword'

useTestDb()

const prev = {} as any

const WEAK_PASSWORD_MESSAGE = 'A jelszónak tartalmaznia kell egy számot, egy nagy batűt és egy kis betűt, valamint legalább 10 karater hosszúnak kell lennie.'

const seedAdmin = (overrides = {}) =>
    Admin.create({ email: 'admin@test.com', password: 'old-hash', ...overrides })

function emailForm(email: string | null = 'admin@test.com') {
    const fd = new FormData()
    if (email !== null) fd.set('email', email)
    return fd
}

function passwordForm(overrides: Record<string, string | null> = {}) {
    const fd = new FormData()
    const fields: Record<string, string | null> = {
        password: 'NewPassword123',
        passwordConfirm: 'NewPassword123',
        ...overrides,
    }
    for (const [k, v] of Object.entries(fields)) if (v !== null) fd.set(k, v)
    return fd
}

beforeEach(() => {
    vi.stubEnv('EMAIL', 'owner@example.com')
    vi.stubEnv('URL', 'example.com')
    send.mockResolvedValue({ data: { id: 'mail-1' }, error: null })
    vi.spyOn(console, 'error').mockImplementation(() => { })
    vi.spyOn(console, 'log').mockImplementation(() => { })
})
afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    vi.clearAllMocks()
    send.mockReset()
})

describe('sendEmail', () => {
    it('returns an error and sends nothing for an unknown email', async () => {
        const res = await sendEmail(prev, emailForm('nobody@test.com'))

        expect(res).toEqual({ error: 'Invalid email ', fieldData: ['nobody@test.com'] })
        expect(send).not.toHaveBeenCalled()
    })

    it('returns an error when no email is submitted', async () => {
        await seedAdmin()
        const res = await sendEmail(prev, emailForm(null))

        expect(res).toMatchObject({ error: expect.any(String) })
        expect(send).not.toHaveBeenCalled()
    })

    it('emails a reset link with a token for the admin and reports success', async () => {
        const admin = await seedAdmin()

        const res = await sendEmail(prev, emailForm())

        expect(res).toEqual({ message: 'success' })
        expect(encryptTwoFA).toHaveBeenCalledWith({
            id: String(admin._id),
            expiresAt: expect.any(Date),
        })
        expect(send).toHaveBeenCalledTimes(1)
        const arg = send.mock.calls[0][0]
        expect(arg.to).toEqual(['owner@example.com'])
        expect(arg.html).toContain('https://example.com/forgotpassword/signed-token')
    })

    it('makes the token expire in about 10 minutes', async () => {
        await seedAdmin()
        const before = Date.now()

        await sendEmail(prev, emailForm())

        const { expiresAt } = vi.mocked(encryptTwoFA).mock.calls[0][0]
        const diff = expiresAt.getTime() - before
        expect(diff).toBeGreaterThanOrEqual(10 * 60 * 1000 - 1000)
        expect(diff).toBeLessThanOrEqual(10 * 60 * 1000 + 1000)
    })

    it('returns an error when Resend fails', async () => {
        await seedAdmin()
        send.mockResolvedValue({ data: null, error: { message: 'rate limited', name: 'rate_limit_exceeded' } })

        const res = await sendEmail(prev, emailForm())

        expect(res).toEqual({ error: 'Hiba, próbáld újra', fieldData: ['admin@test.com'] })
    })

    it('returns a server error when the database call fails', async () => {
        vi.spyOn(Admin, 'findOne').mockRejectedValueOnce(new Error('boom'))

        const res = await sendEmail(prev, emailForm())

        expect(res).toEqual({ error: 'Server error', fieldData: ['admin@test.com'] })
        expect(send).not.toHaveBeenCalled()
    })
})

describe('changePassword', () => {
    it('rejects a caller who is neither logged in nor has a reset url', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)

        const res = await changePassword(prev, passwordForm())

        expect(res).toEqual({
            error: 'Kérlek jelentkezz be.',
            fieldData: ['NewPassword123', 'NewPassword123'],
        })
        expect(checkNewPassPageUlr).not.toHaveBeenCalled()
        expect((await Admin.findById(admin._id))?.password).toBe('old-hash')
    })

    it('rejects a caller whose reset url token is invalid', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        vi.mocked(checkNewPassPageUlr).mockResolvedValue({ error: 'Error' } as any)

        const res = await changePassword(prev, passwordForm({ url: 'bad-token' }))

        expect(checkNewPassPageUlr).toHaveBeenCalledWith('bad-token')
        expect(res).toMatchObject({ error: 'Kérlek jelentkezz be.' })
        expect((await Admin.findById(admin._id))?.password).toBe('old-hash')
    })

    it('returns a validation message for a weak password', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ res: String(admin._id) } as any)

        const res = await changePassword(prev, passwordForm({ password: 'short1A', passwordConfirm: 'short1A' }))

        expect(res.failed).toEqual([WEAK_PASSWORD_MESSAGE])
        expect(res.fieldData).toEqual(['short1A', 'short1A'])
        expect((await Admin.findById(admin._id))?.password).toBe('old-hash')
    })

    it.each([
        ['no digit', 'NoDigitsHerePlease'],
        ['no upper-case letter', 'nouppercase123'],
        ['no lower-case letter', 'NOLOWERCASE123'],
        ['exactly 10 characters', 'Abcdefgh12'],
    ])('rejects a password with %s', async (_label, pw) => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ res: String(admin._id) } as any)

        const res = await changePassword(prev, passwordForm({ password: pw, passwordConfirm: pw }))

        expect(res.failed).toEqual([WEAK_PASSWORD_MESSAGE])
        expect((await Admin.findById(admin._id))?.password).toBe('old-hash')
    })

    it('returns a validation message when the two passwords differ', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ res: String(admin._id) } as any)

        const res = await changePassword(prev, passwordForm({ passwordConfirm: 'OtherPassword123' }))

        expect(res.failed).toEqual(['A két jelszónak meg kell egyeznie.'])
        expect((await Admin.findById(admin._id))?.password).toBe('old-hash')
    })

    it('changes the password for a logged-in admin', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ res: String(admin._id) } as any)

        const res = await changePassword(prev, passwordForm())

        expect(res).toEqual({ message: 'Jelszó megváltozott' })
        expect(checkNewPassPageUlr).not.toHaveBeenCalled()
        // NOTE: the action saves the value as submitted (no hashing).
        expect((await Admin.findById(admin._id))?.password).not.toBe('old-hash')
    })

    it('changes the password for a valid reset url', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        vi.mocked(checkNewPassPageUlr).mockResolvedValue({ res: String(admin._id) } as any)

        const res = await changePassword(prev, passwordForm({ url: 'good-token' }))

        expect(checkNewPassPageUlr).toHaveBeenCalledWith('good-token')
        expect(res).toEqual({ message: 'Jelszó megváltozott' })
        expect((await Admin.findById(admin._id))?.password).not.toBe('old-hash')
    })

    it('only changes the password of the authenticated admin', async () => {
        const admin = await seedAdmin()
        const other = await seedAdmin({ email: 'other@test.com' })
        vi.mocked(checkAuth).mockResolvedValue({ res: String(admin._id) } as any)

        await changePassword(prev, passwordForm())

        expect((await Admin.findById(other._id))?.password).toBe('old-hash')
    })

    it('returns a server error when the database call fails', async () => {
        const admin = await seedAdmin()
        vi.mocked(checkAuth).mockResolvedValue({ res: String(admin._id) } as any)
        vi.spyOn(Admin, 'findByIdAndUpdate').mockRejectedValueOnce(new Error('boom'))

        const res = await changePassword(prev, passwordForm())

        expect(res).toEqual({ error: 'Server error', fieldData: ['NewPassword123', 'NewPassword123'] })
    })
})
