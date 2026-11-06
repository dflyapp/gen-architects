import type { D1Database, Fetcher, R2Bucket } from '@cloudflare/workers-types'

import type { Session } from './lib/auth'

export type Bindings = {
  DB: D1Database
  IMAGES: R2Bucket
  ASSETS: Fetcher
  CMS_ADMIN_USER: string
  CMS_ADMIN_PASSWORD: string
  CMS_SESSION_SECRET: string
  PUBLIC_MEDIA_BASE_URL?: string
}

export type Variables = {
  cmsUser: string
  cmsSession: Session
}

export type AppEnv = {
  Bindings: Bindings
  Variables: Variables
}
