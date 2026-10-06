// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import mongoose from 'mongoose'
import { useTestDb } from '../helper/vitest'
import Service from '@/models/Service'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@/lib/checkTextBSP', () => ({ chooseTypeOfTextItem: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { chooseTypeOfTextItem } from '@/lib/checkTextBSP'
import { updateService } from '@/action/updateService'


useTestDb()

async function seedService(overrides = {}) {
    return Service.create({
        heading: 'My first service',
        text: 'a line',
        detail: 'summary',
        image: 'pic-1',
        keywords: 'test',
        visibility: false,
        ...overrides,
    })
}

function makeFormData(_id: string, overrides: Record<string, string> = {}) {
    const fd = new FormData()
    const fields = {
        heading: 'Updated heading',
        text: 'Updated text',
        detail: 'Updated detail',
        keywords: 'updated, keywords',
        image: 'pic-2',
        _id,
        ...overrides,
    }
    for (const [k, v] of Object.entries(fields)) fd.set(k, v)
    return fd
}

beforeEach(() => {
    vi.mocked(checkAuth).mockResolvedValue({ error: null } as any)
    vi.mocked(chooseTypeOfTextItem).mockReturnValue('paragraph')
})
afterEach(() => {
    vi.clearAllMocks()
})

describe('updateService', () => {
    it('rejects an unauthenticated caller and changes nothing', async () => {
        vi.mocked(checkAuth).mockResolvedValue({ error: 'unauthorized' } as any)
        const service = await seedService()

        const res = await updateService(makeFormData(service._id.toString()))

        expect(res).toEqual({ error: 'Kérlek jelentkezz be.' })
        expect(updateTag).not.toHaveBeenCalled()
        const fresh = await Service.findById(service._id)
        expect(fresh?.heading).toBe('My first service')   // untouched
    })

    it('returns validation messages for an invalid heading', async () => {
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { heading: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Címet kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid text', async () => {
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { text: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Szöveget kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid detail', async () => {
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { detail: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['A leírás megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid keywords', async () => {
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { keywords: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Kulcsszavakat kötelező megadni'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for an invalid image', async () => {
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { image: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Egy kép id-jének megadása kötelező'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns validation messages for a missing _id', async () => {
        // `_id` is chained with both .min(1) and a 24-hex-char .refine(), so
        // an empty string fails both checks and both messages are reported.
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { _id: '' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Az oldal id-jének megadása kötelező', 'Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns a validation message for a malformed (non-ObjectId) _id', async () => {
        const service = await seedService()
        const res = await updateService(makeFormData(service._id.toString(), { _id: 'not-a-valid-id' }))

        expect(res).toHaveProperty('failed')
        expect(res.failed).toEqual(['Érvénytele ID'])
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns an error when a text line fails the type check', async () => {
        vi.mocked(chooseTypeOfTextItem).mockReturnValueOnce('Error: bad line')
        const service = await seedService()

        const res = await updateService(makeFormData(service._id.toString()))

        expect(res).toEqual({ error: 'Error: bad line' })
        expect(updateTag).not.toHaveBeenCalled()
    })

    // updateService strips '\r' only, so multi-line `text` keeps its '\n' line breaks.
    it('saves the service and revalidates all tags on success', async () => {
        const service = await seedService()

        const res = await updateService(makeFormData(service._id.toString(), {
            heading: 'Updated heading',
            text: 'First line\r\nSecond line',
        }))

        expect(res).toEqual({ message: 'A szolgáltatás módosítva' })

        const fresh = await Service.findById(service._id)
        expect(fresh?.heading).toBe('Updated heading')
        expect(fresh?.text).toBe('First line\nSecond line')   // '\r' stripped, '\n' kept

        expect(updateTag).toHaveBeenCalledWith('service-list')
        expect(updateTag).toHaveBeenCalledWith('main-page-services')
        expect(updateTag).toHaveBeenCalledWith('service-page-Updated-heading')
        expect(updateTag).toHaveBeenCalledWith('service-topbar')
        expect(updateTag).toHaveBeenCalledWith('service-footer')
        expect(updateTag).toHaveBeenCalledWith('service-Updated-heading')
        expect(updateTag).toHaveBeenCalledWith('serviceDashboardData')
        expect(updateTag).toHaveBeenCalledTimes(7)
    })

    it('errors when the id is valid but no service exists', async () => {
        const missingId = new mongoose.Types.ObjectId().toString()
        const res = await updateService(makeFormData(missingId))

        expect(res).toEqual({ error: 'A szolgáltatás nem található.' })
        expect(updateTag).not.toHaveBeenCalled()
    })

    it('returns an error on duplicate-key error', async () => {
        const service = await seedService()
        vi.spyOn(Service, 'findByIdAndUpdate').mockRejectedValueOnce(
            Object.assign(new Error('dup'), { code: 11000, keyValue: { heading: 'Updated heading' } })
        )

        const res = await updateService(makeFormData(service._id.toString()))

        expect(res.error).toContain('already exists')
        expect(updateTag).not.toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
