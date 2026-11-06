import { createApp } from './app'

const app = createApp()

/**
 * Cloudflare Worker entry point.
 *
 * Static files (`/styles.css`, `/assets/*`, `/favicon.ico`) are served by the
 * `ASSETS` binding configured in `wrangler.toml`. Requests that do not match a
 * static asset fall through to the Hono application.
 */
export default {
  fetch: app.fetch,
}
