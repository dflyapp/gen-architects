import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'

import type { AppEnv } from '../env'
import { csrfToken } from './auth'
import { safeEqual } from './password'

export function assertSameOrigin(c: Context<AppEnv>): void {
  const origin = c.req.header('origin')
  if (!origin) {
    return
  }

  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    throw new HTTPException(403, { message: 'Invalid request origin.' })
  }

  const host = c.req.header('host')
  if (!host || originHost !== host) {
    throw new HTTPException(403, { message: 'Cross-origin request rejected.' })
  }
}

export async function assertCsrf(
  c: Context<AppEnv>,
  form: FormData
): Promise<void> {
  assertSameOrigin(c)

  const session = c.get('cmsSession')
  if (!session) {
    throw new HTTPException(403, { message: 'Missing CMS session.' })
  }

  const submitted = form.get('_csrf')
  if (typeof submitted !== 'string' || submitted.length === 0) {
    throw new HTTPException(403, { message: 'Missing CSRF token.' })
  }

  const expected = await csrfToken(c.env, session)
  if (!safeEqual(submitted, expected)) {
    throw new HTTPException(403, { message: 'Invalid CSRF token.' })
  }
}
