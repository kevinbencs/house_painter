// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const { cookieDelete } = vi.hoisted(() => ({ cookieDelete: vi.fn() }))

vi.mock('next/headers', () => ({
  cookies: vi.fn(async () => ({ delete: cookieDelete })),
}))
vi.mock('next/navigation', () => ({
  redirect: vi.fn((url: string) => { throw new Error(`REDIRECT:${url}`) }),
}))

import { redirect } from 'next/navigation'
import { logout } from '@/action/logout'

afterEach(() => vi.clearAllMocks())

describe('logout', () => {
  it('deletes the auth cookie and redirects home', async () => {
    await expect(logout()).rejects.toThrow('REDIRECT:/')

    expect(cookieDelete).toHaveBeenCalledWith('AuthToken')
    expect(redirect).toHaveBeenCalledWith('/')
  })
})