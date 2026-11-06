import { Hono } from 'hono'

import Carousel from './components/Carousel'
import { projects, wrap } from './data/model'
import Layout from './layout'
import Home from './views/Home'
import Work from './views/Work'

/**
 * Registers all application routes.
 *
 * Static files are intentionally not handled here:
 * - Node (`src/server.tsx`) serves them with `@hono/node-server/serve-static`
 * - Cloudflare Workers serve them from the `ASSETS` binding declared in `wrangler.toml`
 */
export function createApp() {
  const app = new Hono()

  app.get('/', (c) => {
    return c.html(
      <Layout title="Gen Architects">
        <Home />
      </Layout>
    )
  })

  app.get('/work/:pid', (c) => {
    const pid = Number(c.req.param('pid'))
    const project = projects.find((item) => item.id === pid)

    if (!project) {
      return c.notFound()
    }

    return c.html(
      <Layout title={project.name}>
        <Work project={project} />
      </Layout>
    )
  })

  app.get('/partials/carousel', (c) => {
    const index = Number(c.req.query('index') ?? 0)
    const activeIndex = wrap(0, projects.length, index)
    return c.html(<Carousel index={activeIndex} />)
  })

  app.get('/api/hello', (c) => c.json({ name: 'John Doe' }))

  app.notFound((c) => {
    return c.html(
      <Layout title="Page not found">
        <main class="p-8">
          <h1>404</h1>
          <p>Page not found.</p>
          <a class="underline" href="/">
            Back to gallery
          </a>
        </main>
      </Layout>,
      404
    )
  })

  app.onError((error, c) => {
    console.error(error)
    return c.html(
      <Layout title="Something went wrong">
        <main class="p-8">
          <h1>500</h1>
          <p>Something went wrong.</p>
          <a class="underline" href="/">
            Back to gallery
          </a>
        </main>
      </Layout>,
      500
    )
  })

  return app
}
