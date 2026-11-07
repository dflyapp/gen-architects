import { html } from 'hono/html'

type CmsLayoutProps = {
  title: string
  user?: string
  csrfToken?: string
  children?: unknown
}

export default function CmsLayout({
  title,
  user,
  csrfToken,
  children,
}: CmsLayoutProps) {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>${title} · GEN CMS</title>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-gray-100 text-gray-900 min-h-screen">
        <header class="bg-primary text-white">
          <div class="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-6">
              <a href="/cms" class="text-xl font-semibold tracking-wide">
                GEN CMS
              </a>
              <a href="/" class="text-sm underline opacity-80 hover:opacity-100">
                View site
              </a>
            </div>
            ${user && csrfToken
              ? html`<div class="flex items-center gap-4 text-sm">
                  <span class="opacity-80">${user}</span>
                  <form method="post" action="/cms/logout">
                    <input type="hidden" name="_csrf" value="${csrfToken}" />
                    <button type="submit" class="underline hover:no-underline">
                      Log out
                    </button>
                  </form>
                </div>`
              : ''}
          </div>
        </header>
        <main class="max-w-6xl mx-auto px-6 py-8">${children}</main>
      </body>
    </html>`
}
