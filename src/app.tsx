import type { Context, Next } from 'hono'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'

import Carousel from './components/Carousel'
import { wrap } from './data/model'
import {
  addProjectImages,
  createProject,
  deleteProject,
  deleteProjectImage,
  updateProject,
  updateProjectCover,
} from './db/mutations'
import {
  getAllProjects,
  getProjectById,
  getPublishedProjects,
} from './db/queries'
import type { AppEnv } from './env'
import {
  clearSessionCookie,
  csrfToken,
  getSession,
  issueSession,
  setSessionCookie,
} from './lib/auth'
import { assertCsrf, assertSameOrigin } from './lib/csrf'
import {
  deleteImage,
  putImage,
  serveMedia,
  validateImageFile,
} from './lib/media'
import { checkCredentials } from './lib/password'
import {
  projectFormValuesFromProject,
  readImageUpdates,
  readProjectForm,
  type ProjectFormValues,
} from './lib/validation'
import Layout, {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  SITE_URL,
} from './layout'
import Home from './views/Home'
import Work from './views/Work'
import CmsLayout from './views/cms/CmsLayout'
import Dashboard from './views/cms/Dashboard'
import Login from './views/cms/Login'
import ProjectForm from './views/cms/ProjectForm'

function parseId(value: string | undefined): number | null {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}

// Normalize a media URL to an absolute URL so Open Graph and
// Twitter Card crawlers can resolve the image regardless of whether
// the stored path is relative or absolute.
function absoluteUrl(value: string): string {
  if (!value) {
    return DEFAULT_OG_IMAGE
  }
  if (/^https?:\/\//i.test(value)) {
    return value
  }
  return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`
}

function emptyProjectValues(): ProjectFormValues {
  return {
    name: '',
    category: '',
    tag: '',
    location: '',
    description: '',
    coverDesc: '',
    published: false,
    sortOrder: 0,
    packageText: '',
  }
}

async function renderCms(
  c: Context<AppEnv>,
  title: string,
  children: unknown,
  status: 200 | 400 | 401 | 403 | 404 | 500 = 200
) {
  const session = c.get('cmsSession') || (await getSession(c))
  const token = session ? await csrfToken(c.env, session) : undefined

  return c.html(
    <CmsLayout title={title} user={session?.sub} csrfToken={token}>
      {children}
    </CmsLayout>,
    status
  )
}

async function renderProjectForm(
  c: Context<AppEnv>,
  project: Awaited<ReturnType<typeof getProjectById>>,
  values: ProjectFormValues,
  errors: Record<string, string>,
  isNew: boolean,
  status: 200 | 400 = 200
) {
  const session = c.get('cmsSession')
  const token = await csrfToken(c.env, session)

  return c.html(
    <CmsLayout
      title={isNew ? 'New project' : 'Edit project'}
      user={session.sub}
      csrfToken={token}
    >
      <ProjectForm
        project={project}
        values={values}
        errors={errors}
        csrfToken={token}
        isNew={isNew}
      />
    </CmsLayout>,
    status
  )
}

const requireCmsAuth = async (c: Context<AppEnv>, next: Next) => {
  if (
    c.req.path === '/cms/login' ||
    c.req.path === '/cms/logout'
  ) {
    await next()
    return
  }

  const session = await getSession(c)
  if (!session) {
    return c.redirect('/cms/login', 303)
  }

  c.set('cmsUser', session.sub)
  c.set('cmsSession', session)
  await next()
}

/**
 * Registers all application routes.
 *
 * Static files are served by the `ASSETS` binding configured in
 * `wrangler.toml`. Requests that do not match a static asset fall through to
 * this Hono application.
 */
export function createApp() {
  const app = new Hono<AppEnv>()

  app.use('/cms', requireCmsAuth)
  app.use('/cms/*', requireCmsAuth)

  app.get('/', async (c) => {
    const projects = await getPublishedProjects(c.env.DB)
    return c.html(
      <Layout
        title={SITE_NAME}
        description={DEFAULT_DESCRIPTION}
        canonical={SITE_URL}
        ogImage={DEFAULT_OG_IMAGE}
      >
        <Home projects={projects} />
      </Layout>
    )
  })

  app.get('/work/:pid', async (c) => {
    const pid = parseId(c.req.param('pid'))
    if (pid === null) {
      return c.notFound()
    }

    const projects = await getPublishedProjects(c.env.DB)
    const project = projects.find((item) => item.id === pid)

    if (!project) {
      return c.notFound()
    }

    const url = `${SITE_URL}/work/${project.id}`
    const description =
      project.description || project.coverDesc || DEFAULT_DESCRIPTION
    const ogImage = absoluteUrl(project.cover || DEFAULT_OG_IMAGE)

    const projectJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.name,
      description,
      url,
      image: ogImage,
      ...(project.location ? { contentLocation: project.location } : {}),
      ...(project.tag ? { keywords: project.tag } : {}),
      ...(project.category ? { genre: project.category } : {}),
    }

    return c.html(
      <Layout
        title={project.name}
        description={description}
        canonical={url}
        ogType="article"
        ogImage={ogImage}
        ogImageAlt={project.name}
        jsonLd={projectJsonLd}
      >
        <Work project={project} projects={projects} />
      </Layout>
    )
  })

  app.get('/partials/carousel', async (c) => {
    const projects = await getPublishedProjects(c.env.DB)
    const parsedIndex = Number(c.req.query('index') ?? 0)
    const index = Number.isFinite(parsedIndex) ? parsedIndex : 0
    const activeIndex =
      projects.length > 0 ? wrap(0, projects.length, index) : 0

    return c.html(
      <Carousel index={activeIndex} projects={projects} />
    )
  })

  app.get('/media/*', async (c) => {
    let key: string
    try {
      key = decodeURIComponent(c.req.path.slice('/media/'.length))
    } catch {
      return c.notFound()
    }

    if (!key) {
      return c.notFound()
    }

    const response = await serveMedia(c.env, key, c.req.raw)
    return response ?? c.notFound()
  })

  app.get('/robots.txt', (c) =>
    c.text(
      `User-agent: *\nAllow: /\nDisallow: /cms\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
      200,
      { 'Content-Type': 'text/plain; charset=utf-8' }
    )
  )

  app.get('/sitemap.xml', async (c) => {
    const projects = await getPublishedProjects(c.env.DB)

    const urls = [
      { loc: SITE_URL, priority: '1.0' },
      ...projects.map((project) => ({
        loc: `${SITE_URL}/work/${project.id}`,
        priority: '0.8',
      })),
    ]
      .map(
        ({ loc, priority }) =>
          `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`
      )
      .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

    return c.text(xml, 200, {
      'Content-Type': 'application/xml; charset=utf-8',
    })
  })

  app.get('/api/hello', (c) => c.json({ name: 'John Doe' }))

  app.get('/cms', async (c) => {
    const projects = await getAllProjects(c.env.DB)
    return renderCms(
      c,
      'Projects',
      <Dashboard projects={projects} />
    )
  })

  app.get('/cms/login', async (c) => {
    const session = await getSession(c)
    if (session) {
      return c.redirect('/cms', 303)
    }
    return renderCms(c, 'Login', <Login />)
  })

  app.post('/cms/login', async (c) => {
    assertSameOrigin(c)
    const form = await c.req.formData()
    const username = form.get('username')
    const password = form.get('password')

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !checkCredentials(
        c.env.CMS_ADMIN_USER,
        c.env.CMS_ADMIN_PASSWORD,
        username,
        password
      )
    ) {
      return renderCms(
        c,
        'Login',
        <Login error="Invalid username or password." />,
        401
      )
    }

    const { token } = await issueSession(c.env, username)
    setSessionCookie(c, token)
    return c.redirect('/cms', 303)
  })

  app.post('/cms/logout', async (c) => {
    assertSameOrigin(c)
    const session = await getSession(c)

    if (session) {
      c.set('cmsSession', session)
      const form = await c.req.formData()
      await assertCsrf(c, form)
    }

    clearSessionCookie(c)
    return c.redirect('/cms/login', 303)
  })

  app.get('/cms/projects/new', async (c) => {
    return renderProjectForm(
      c,
      null,
      emptyProjectValues(),
      {},
      true
    )
  })

  app.post('/cms/projects', async (c) => {
    const form = await c.req.formData()
    await assertCsrf(c, form)

    const result = readProjectForm(form)
    if (!result.ok) {
      return renderProjectForm(
        c,
        null,
        result.values,
        result.errors,
        true,
        400
      )
    }

    const id = await createProject(
      c.env.DB,
      result.values,
      result.packages
    )
    return c.redirect(`/cms/projects/${id}/edit`, 303)
  })

  app.get('/cms/projects/:id/edit', async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === null) {
      return c.notFound()
    }

    const project = await getProjectById(c.env.DB, id)
    if (!project) {
      return c.notFound()
    }

    return renderProjectForm(
      c,
      project,
      projectFormValuesFromProject(project),
      {},
      false
    )
  })

  app.post('/cms/projects/:id', async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === null) {
      return c.notFound()
    }

    const form = await c.req.formData()
    await assertCsrf(c, form)

    const project = await getProjectById(c.env.DB, id)
    if (!project) {
      return c.notFound()
    }

    const result = readProjectForm(form)
    if (!result.ok) {
      return renderProjectForm(
        c,
        project,
        result.values,
        result.errors,
        false,
        400
      )
    }

    await updateProject(
      c.env.DB,
      id,
      result.values,
      result.packages,
      readImageUpdates(form, project.images)
    )
    return c.redirect(`/cms/projects/${id}/edit`, 303)
  })

  app.post('/cms/projects/:id/cover', async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === null) {
      return c.notFound()
    }

    const form = await c.req.formData()
    await assertCsrf(c, form)

    const project = await getProjectById(c.env.DB, id)
    if (!project) {
      return c.notFound()
    }

    const file = form.get('cover')
    if (!(file instanceof File)) {
      throw new HTTPException(400, {
        message: 'Choose a cover image to upload.',
      })
    }

    const validationError = validateImageFile(file)
    if (validationError) {
      throw new HTTPException(400, { message: validationError })
    }

    const uploaded = await putImage(c.env, id, file)
    try {
      await updateProjectCover(
        c.env.DB,
        id,
        uploaded.url,
        uploaded.key
      )
    } catch (error) {
      await deleteImage(c.env, uploaded.key)
      throw error
    }

    await deleteImage(c.env, project.coverKey)
    return c.redirect(`/cms/projects/${id}/edit`, 303)
  })

  app.post('/cms/projects/:id/images', async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === null) {
      return c.notFound()
    }

    const form = await c.req.formData()
    await assertCsrf(c, form)

    const project = await getProjectById(c.env.DB, id)
    if (!project) {
      return c.notFound()
    }

    const files = form
      .getAll('images')
      .filter(
        (value): value is File =>
          value instanceof File && value.size > 0
      )

    if (files.length === 0) {
      throw new HTTPException(400, {
        message: 'Choose at least one image to upload.',
      })
    }

    for (const file of files) {
      const validationError = validateImageFile(file)
      if (validationError) {
        throw new HTTPException(400, { message: validationError })
      }
    }

    const maxOrder = project.images.reduce(
      (max, image) => Math.max(max, image.sortOrder ?? 0),
      0
    )

    const uploaded: Array<{
      url: string
      r2Key: string
      detail: string
      sortOrder: number
    }> = []

    try {
      for (const [index, file] of files.entries()) {
        const image = await putImage(c.env, id, file)
        uploaded.push({
          url: image.url,
          r2Key: image.key,
          detail: '',
          sortOrder: maxOrder + index + 1,
        })
      }
    } catch (error) {
      await Promise.all(
        uploaded.map((image) =>
          deleteImage(c.env, image.r2Key)
        )
      )
      throw error
    }

    try {
      await addProjectImages(c.env.DB, id, uploaded)
    } catch (error) {
      await Promise.all(
        uploaded.map((image) =>
          deleteImage(c.env, image.r2Key)
        )
      )
      throw error
    }

    return c.redirect(`/cms/projects/${id}/edit`, 303)
  })

  app.post(
    '/cms/projects/:id/images/:imageId/delete',
    async (c) => {
      const id = parseId(c.req.param('id'))
      const imageId = parseId(c.req.param('imageId'))
      if (id === null || imageId === null) {
        return c.notFound()
      }

      const form = await c.req.formData()
      await assertCsrf(c, form)

      const project = await getProjectById(c.env.DB, id)
      if (!project) {
        return c.notFound()
      }

      const image = project.images.find(
        (item) => item.id === imageId
      )
      if (!image) {
        return c.notFound()
      }

      await deleteProjectImage(c.env.DB, id, imageId)
      await deleteImage(c.env, image.r2Key)
      return c.redirect(`/cms/projects/${id}/edit`, 303)
    }
  )

  app.post('/cms/projects/:id/delete', async (c) => {
    const id = parseId(c.req.param('id'))
    if (id === null) {
      return c.notFound()
    }

    const form = await c.req.formData()
    await assertCsrf(c, form)

    const project = await getProjectById(c.env.DB, id)
    if (!project) {
      return c.notFound()
    }

    const keys = [
      project.coverKey,
      ...project.images.map((image) => image.r2Key),
    ].filter((key): key is string => Boolean(key))

    await deleteProject(c.env.DB, id)
    await Promise.all(keys.map((key) => deleteImage(c.env, key)))
    return c.redirect('/cms', 303)
  })

  app.notFound(async (c) => {
    if (c.req.path.startsWith('/cms')) {
      return renderCms(
        c,
        'Page not found',
        <div class="rounded bg-white p-6 shadow">
          <h1 class="text-3xl font-semibold">404</h1>
          <p class="mt-2">Page not found.</p>
          <a class="mt-4 inline-block underline" href="/cms">
            Back to dashboard
          </a>
        </div>,
        404
      )
    }

    return c.html(
      <Layout title="Page not found" noindex>
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

  app.onError(async (error, c) => {
    const status =
      error instanceof HTTPException ? error.status : 500
    const message =
      error instanceof HTTPException && status < 500
        ? error.message
        : 'Something went wrong.'

    if (status >= 500) {
      console.error(error)
    }

    if (c.req.path.startsWith('/cms')) {
      const pageStatus =
        status >= 500 ? 500 : (status as 400 | 401 | 403 | 404)
      return renderCms(
        c,
        status >= 500 ? 'Something went wrong' : 'Request error',
        <div class="rounded bg-white p-6 shadow">
          <h1 class="text-3xl font-semibold">{status}</h1>
          <p class="mt-2">{message}</p>
          <a class="mt-4 inline-block underline" href="/cms">
            Back to dashboard
          </a>
        </div>,
        pageStatus
      )
    }

    return c.html(
      <Layout title="Something went wrong" noindex>
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
