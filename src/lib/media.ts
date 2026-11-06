import type { Bindings } from '../env'

export const MAX_IMAGE_BYTES = 10 * 1024 * 1024

const EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

export const ALLOWED_IMAGE_TYPES = Object.keys(EXTENSIONS)

export const MEDIA_CACHE_CONTROL =
  'public, max-age=31536000, immutable'

export function validateImageFile(file: File): string | null {
  if (file.size === 0) {
    return 'The file is empty.'
  }
  if (!EXTENSIONS[file.type]) {
    return 'Only JPEG, PNG, WebP, and AVIF images are allowed.'
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Images must be 10 MB or smaller.'
  }
  return null
}

export async function putImage(
  env: Bindings,
  projectId: number,
  file: File
): Promise<{ key: string; url: string }> {
  const extension = EXTENSIONS[file.type]
  if (!extension) {
    throw new Error('Unsupported image type.')
  }

  const key = `projects/${projectId}/${crypto.randomUUID()}.${extension}`
  const body = await file.arrayBuffer()
  await env.IMAGES.put(key, body, {
    httpMetadata: {
      contentType: file.type,
      cacheControl: MEDIA_CACHE_CONTROL,
    },
  })

  const base = env.PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, '')
  return { key, url: base ? `${base}/${key}` : `/media/${key}` }
}

export async function deleteImage(
  env: Bindings,
  key: string | null | undefined
): Promise<void> {
  if (!key) {
    return
  }
  await env.IMAGES.delete(key)
}

export async function serveMedia(
  env: Bindings,
  key: string,
  request: Request
): Promise<Response | null> {
  const object = await env.IMAGES.get(key)
  if (!object) {
    return null
  }

  const headers = new Headers()
  headers.set(
    'Content-Type',
    object.httpMetadata?.contentType ?? 'application/octet-stream'
  )
  headers.set(
    'Cache-Control',
    object.httpMetadata?.cacheControl ?? MEDIA_CACHE_CONTROL
  )
  if (object.httpEtag) {
    headers.set('ETag', object.httpEtag)
  }

  if (
    object.httpEtag &&
    request.headers.get('if-none-match') === object.httpEtag
  ) {
    return new Response(null, { status: 304, headers })
  }

  return new Response(object.body as unknown as BodyInit, { headers })
}
