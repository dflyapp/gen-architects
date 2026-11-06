import type { Context } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'

import type { AppEnv } from '../env'
import { safeEqual } from './password'

export type Session = {
  sub: string
  exp: number
  nonce: string
}

export const CMS_COOKIE_NAME = 'cms_session'
const SESSION_TTL_SECONDS = 60 * 60 * 12
const encoder = new TextEncoder()

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

function base64UrlDecode(value: string): Uint8Array {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

async function hmac(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(data)
  )
  return new Uint8Array(signature)
}

export async function issueSession(
  env: AppEnv['Bindings'],
  user: string
): Promise<{ token: string; session: Session }> {
  const session: Session = {
    sub: user,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    nonce: crypto.randomUUID(),
  }
  const payload = base64UrlEncode(
    encoder.encode(JSON.stringify(session))
  )
  const signature = base64UrlEncode(
    await hmac(env.CMS_SESSION_SECRET, payload)
  )

  return { token: `${payload}.${signature}`, session }
}

export async function readSession(
  env: AppEnv['Bindings'],
  token: string | undefined
): Promise<Session | null> {
  if (!token) {
    return null
  }

  const [payload, signature] = token.split('.')
  if (!payload || !signature) {
    return null
  }

  const expectedSignature = base64UrlEncode(
    await hmac(env.CMS_SESSION_SECRET, payload)
  )
  if (!safeEqual(signature, expectedSignature)) {
    return null
  }

  try {
    const session = JSON.parse(
      new TextDecoder().decode(base64UrlDecode(payload))
    ) as Session

    if (!session.sub || !session.exp || !session.nonce) {
      return null
    }
    if (session.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return session
  } catch {
    return null
  }
}

export async function csrfToken(
  env: AppEnv['Bindings'],
  session: Session
): Promise<string> {
  const signature = await hmac(
    env.CMS_SESSION_SECRET,
    `csrf:${session.sub}:${session.nonce}:${session.exp}`
  )
  return base64UrlEncode(signature)
}

function sessionCookieOptions(c: Context<AppEnv>) {
  const isHttps =
    new URL(c.req.url).protocol === 'https:' ||
    c.req.header('x-forwarded-proto') === 'https'

  return {
    httpOnly: true,
    sameSite: 'Lax' as const,
    path: '/',
    secure: isHttps,
    maxAge: SESSION_TTL_SECONDS,
  }
}

export function setSessionCookie(c: Context<AppEnv>, token: string): void {
  setCookie(c, CMS_COOKIE_NAME, token, sessionCookieOptions(c))
}

export function clearSessionCookie(c: Context<AppEnv>): void {
  deleteCookie(c, CMS_COOKIE_NAME, { path: '/' })
}

export async function getSession(
  c: Context<AppEnv>
): Promise<Session | null> {
  return readSession(c.env, getCookie(c, CMS_COOKIE_NAME))
}
