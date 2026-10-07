// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { send } = vi.hoisted(() => ({ send: vi.fn() }))

vi.mock('resend', () => ({
    Resend: class {
        emails = { send }
    },
}))

import { sendMessage } from '@/action/sendMessage'

function makeFormData(overrides: Record<string, string | null> = {}) {
    const fd = new FormData()
    const fields: Record<string, string | null> = {
        name: 'Teszt Elek',
        email: 'elek@example.com',
        message: 'Szeretnék árajánlatot kérni.',
        privacy: 'on',
        ...overrides,
    }
    for (const [k, v] of Object.entries(fields)) if (v !== null) fd.set(k, v)
    return fd
}

beforeEach(() => {
    vi.stubEnv('EMAIL', 'owner@example.com')
    send.mockResolvedValue({ data: { id: 'mail-1' }, error: null })
    vi.spyOn(console, 'error').mockImplementation(() => { })
})
afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
    send.mockReset()
})

describe('sendMessage', () => {
    it('returns a validation message for an empty name', async () => {
        const res = await sendMessage(makeFormData({ name: '' }))

        expect(res.failed).toEqual(['Nevet kötelezó megadni'])
        expect(send).not.toHaveBeenCalled()
    })

    it('returns a validation message for an invalid email', async () => {
        const res = await sendMessage(makeFormData({ email: 'not-an-email' }))

        expect(res.failed).toEqual(['Email-t kötelező megadni'])
        expect(send).not.toHaveBeenCalled()
    })

    it('returns a validation message for an empty message', async () => {
        const res = await sendMessage(makeFormData({ message: '' }))

        expect(res.failed).toEqual(['Üzenetet kötelezó megadni'])
        expect(send).not.toHaveBeenCalled()
    })

    it('returns a validation message when the privacy box is not ticked', async () => {
        const res = await sendMessage(makeFormData({ privacy: null }))

        expect(res.failed).toEqual(['A felhasználói feltételek elfogadása kötelező'])
        expect(send).not.toHaveBeenCalled()
    })

    it('returns a validation message when privacy has a value other than "on"', async () => {
        const res = await sendMessage(makeFormData({ privacy: 'off' }))

        expect(res.failed).toEqual(['A felhasználói feltételek elfogadása kötelező'])
        expect(send).not.toHaveBeenCalled()
    })

    it('echoes the submitted fields back on a validation failure', async () => {
        const res = await sendMessage(makeFormData({ name: '' }))

        expect(res.fieldData).toEqual(['', 'elek@example.com', 'Szeretnék árajánlatot kérni.', true])
    })

    it('reports every failing field at once', async () => {
        const res = await sendMessage(makeFormData({ name: '', message: '', email: 'bad' }))

        expect(res.failed).toEqual([
            'Email-t kötelező megadni',
            'Nevet kötelezó megadni',
            'Üzenetet kötelezó megadni',
        ])
    })

    it('sends the email to the owner and reports success', async () => {
        const res = await sendMessage(makeFormData())

        expect(res).toEqual({ message: 'Üzenet elküldve' })
        expect(send).toHaveBeenCalledTimes(1)
        expect(send).toHaveBeenCalledWith(expect.objectContaining({
            to: ['owner@example.com'],
            subject: 'Árajánlat kérés: Teszt Elek',
            html: '<div>Szeretnék árajánlatot kérni.</div><div>Név: Teszt Elek</div><div>Email: elek@example.com</div>',
        }))
    })

    it('returns an error and the submitted fields when Resend fails', async () => {
        send.mockResolvedValue({ data: null, error: { message: 'rate limited', name: 'rate_limit_exceeded' } })

        const res = await sendMessage(makeFormData())

        expect(res).toEqual({
            error: 'Hiba, próbáld újra',
            fieldData: ['Teszt Elek', 'elek@example.com', 'Szeretnék árajánlatot kérni.', true],
        })
    })
})
