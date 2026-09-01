// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useTestDb } from '../helper/vitest' 
import Image from '@/models/Image'

vi.mock('next/cache', () => ({ updateTag: vi.fn() }))
vi.mock('@/lib/checkAuth', () => ({ checkAuth: vi.fn() }))
vi.mock('@vercel/blob', () => ({ put: vi.fn() }))
vi.mock('@/lib/data', () => ({ getNumbOfImagPage: vi.fn() }))

import { updateTag } from 'next/cache'
import { checkAuth } from '@/lib/checkAuth'
import { put } from '@vercel/blob'
import { getNumbOfImagPage } from '@/lib/data'
import { AddImage } from '@/action/addImage'   

useTestDb()

const prev = {} as any

function imageFile(name = 'cat.png') {
  return new File([new Uint8Array([1, 2, 3])], name, { type: 'image/png' })
}
function form({ file = imageFile(), alt = 'egy cica', url = 'macska' }: any = {}) {
  const fd = new FormData()
  if (file !== null) fd.set('image', file)
  fd.set('image-alt', alt)
  fd.set('image-url', url)
  return fd
}

beforeEach(() => {
  vi.stubEnv('BLOB_READ_WRITE_TOKEN', 'test-token')
  vi.mocked(checkAuth).mockResolvedValue({ success: 'admin-1' } as any)   
  vi.mocked(put).mockResolvedValue({ pathname: 'blobs/cat-abc.png' } as any)
  vi.mocked(getNumbOfImagPage).mockResolvedValue(2)                      
})
afterEach(() => {
  vi.unstubAllEnvs()
  vi.clearAllMocks()
})

describe('AddImage', () => {
  it('rejects an unauthenticated caller and uploads nothing', async () => {
    vi.mocked(checkAuth).mockResolvedValue({ error: 'no token' } as any)
    const res = await AddImage(prev, form())
    expect(res).toMatchObject({ error: 'Kérlek jelentkezz be.' })
    expect(put).not.toHaveBeenCalled()
    expect(await Image.countDocuments()).toBe(0)
  })

  it('returns validation messages for a bad body', async () => {
    const res = await AddImage(prev, form({ url: '' })) 
    expect(res).toHaveProperty('failed')
    expect(put).not.toHaveBeenCalled()
  })

  it('rejects a duplicate url before uploading', async () => {
    await Image.create({ newUrl: 'macska.png', blobUrl: 'x', detail: 'régi' })
    const res = await AddImage(prev, form({ url: 'macska' }))  
    expect(res).toMatchObject({ error: 'Az url-t már használja egy másik kép.' })
    expect(put).not.toHaveBeenCalled()
    expect(updateTag).not.toHaveBeenCalled()
  })

  it('uploads, saves, and revalidates the right tags on success', async () => {
    const res = await AddImage(prev, form({ url: 'macska' }))

    expect(res).toEqual({ message: 'Kép feltöltve' })


    const docs = await Image.find()
    expect(docs).toHaveLength(1)
    expect(docs[0].newUrl).toBe('macska.png')
    expect(docs[0].blobUrl).toBe('blobs/cat-abc.png')
    expect(docs[0].detail).toBe('egy cica')


    expect(put).toHaveBeenCalledWith('cat.png', expect.any(File),
      expect.objectContaining({ access: 'public', token: 'test-token', addRandomSuffix: true }))


    expect(updateTag).toHaveBeenCalledWith('main-page-images')
    expect(updateTag).toHaveBeenCalledWith('img-numb')
    expect(updateTag).toHaveBeenCalledWith('img-data-1')
    expect(updateTag).toHaveBeenCalledWith('image-site-2')
    expect(updateTag).toHaveBeenCalledTimes(6)
  })

  it('returns "missing image" when the field is not a File', async () => {
    const res = await AddImage(prev, form({ file: 'not-a-file' }))

    expect(res).toMatchObject({ error: 'Hiányzik a kép' })
  })
})