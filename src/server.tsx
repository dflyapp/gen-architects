import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

import { createApp } from './app'

const app = createApp()

// Local static file serving for the Node runtime.
// Cloudflare Workers serve these files through the `ASSETS` binding instead.
app.use('/favicon.ico', serveStatic({ path: './public/favicon.ico' }))
app.use('/styles.css', serveStatic({ path: './public/styles.css' }))
app.use('/assets/*', serveStatic({ root: './src' }))

const port = Number(process.env.PORT) || 3000

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`)
})
