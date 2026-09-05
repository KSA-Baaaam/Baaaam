import { supabase } from '@/lib/supabase'

export const POST_IMAGE_MAX_SOURCE_BYTES = 10 * 1024 * 1024
export const POST_IMAGE_MAX_BYTES = 5 * 1024 * 1024
export const POST_IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

const POST_IMAGE_BUCKET = 'post-images'
const supportedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export type UploadedPostImage = {
  path: string
  publicUrl: string
  width: number
  height: number
}

export function validatePostImage(file: File): string | null {
  if (!supportedTypes.has(file.type)) return 'JPG, PNG, WEBP 형식의 사진만 업로드할 수 있어요.'
  if (file.size > POST_IMAGE_MAX_SOURCE_BYTES) return '원본 사진은 10MB 이하여야 해요.'
  return null
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('사진을 변환하지 못했어요.'))
    }, 'image/webp', quality)
  })
}

async function decodePostImage(file: File): Promise<{ source: CanvasImageSource; width: number; height: number; release: () => void }> {
  if ('createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file)
      return { source: bitmap, width: bitmap.width, height: bitmap.height, release: () => bitmap.close() }
    } catch {
      // Some browsers reject otherwise valid camera images here. The image element path is a safe fallback.
    }
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('사진 파일을 읽지 못했어요. 다른 사진을 선택해주세요.'))
      element.src = objectUrl
    })
    return {
      source: image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      release: () => URL.revokeObjectURL(objectUrl),
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

export async function optimizePostImage(file: File) {
  const validationError = validatePostImage(file)
  if (validationError) throw new Error(validationError)

  const decoded = await decodePostImage(file)
  if (!decoded.width || !decoded.height) {
    decoded.release()
    throw new Error('사진 크기를 확인하지 못했어요. 다른 사진을 선택해주세요.')
  }
  const scale = Math.min(1, 1600 / decoded.width)
  const width = Math.max(1, Math.round(decoded.width * scale))
  const height = Math.max(1, Math.round(decoded.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')
  if (!context) {
    decoded.release()
    throw new Error('사진을 처리할 수 없는 브라우저입니다.')
  }
  try {
    context.drawImage(decoded.source, 0, 0, width, height)
  } finally {
    decoded.release()
  }

  let quality = 0.84
  let blob = await canvasToBlob(canvas, quality)
  while (blob.size > POST_IMAGE_MAX_BYTES && quality > 0.55) {
    quality -= 0.08
    blob = await canvasToBlob(canvas, quality)
  }
  if (blob.size > POST_IMAGE_MAX_BYTES) throw new Error('사진을 5MB 이하로 줄이지 못했어요. 더 작은 사진을 선택해주세요.')

  return {
    file: new File([blob], 'image.webp', { type: 'image/webp' }),
    width,
    height,
  }
}

function pathFromPublicUrl(publicUrl: string) {
  const marker = `/storage/v1/object/public/${POST_IMAGE_BUCKET}/`
  const encodedPath = publicUrl.split(marker)[1]?.split('?')[0]
  return encodedPath ? decodeURIComponent(encodedPath) : null
}

function friendlyStorageError(message: string) {
  if (/row-level security|unauthorized|permission/i.test(message)) return new Error('사진을 업로드할 권한이 없습니다. 계정 권한을 확인해주세요.')
  if (/bucket.*not found/i.test(message)) return new Error('사진 저장소를 찾지 못했어요. 관리자에게 문의해주세요.')
  return new Error('사진을 업로드하지 못했어요. 잠시 후 다시 시도해주세요.')
}

export const postImagesService = {
  async upload(
    source: File,
    options: { postKey?: string; onProgress?: (progress: number) => void } = {},
  ): Promise<UploadedPostImage> {
    options.onProgress?.(10)
    const optimized = await optimizePostImage(source)
    options.onProgress?.(55)

    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData.user) throw new Error('로그인이 필요합니다.')

    const safePostKey = (options.postKey ?? 'new').replace(/[^a-zA-Z0-9-]/g, '') || 'new'
    const path = `posts/${userData.user.id}/${safePostKey}/${crypto.randomUUID()}.webp`
    const { error: uploadError } = await supabase.storage
      .from(POST_IMAGE_BUCKET)
      .upload(path, optimized.file, {
        cacheControl: '31536000',
        contentType: 'image/webp',
        upsert: false,
      })

    if (uploadError) throw friendlyStorageError(uploadError.message)
    options.onProgress?.(100)

    const { data } = supabase.storage.from(POST_IMAGE_BUCKET).getPublicUrl(path)
    return { path, publicUrl: data.publicUrl, width: optimized.width, height: optimized.height }
  },

  async remove(path: string) {
    const { error } = await supabase.storage.from(POST_IMAGE_BUCKET).remove([path])
    if (error) throw new Error(error.message)
  },

  async removeByPublicUrl(publicUrl: string) {
    const path = pathFromPublicUrl(publicUrl)
    if (!path) return
    const { error } = await supabase.storage.from(POST_IMAGE_BUCKET).remove([path])
    if (error) throw new Error(error.message)
  },
}
