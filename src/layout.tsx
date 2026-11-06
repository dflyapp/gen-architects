import { html, raw } from 'hono/html'

type LayoutProps = {
  title: string
  children?: unknown
}

const analytics = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-P2Z499R4XQ');
`

export default function Layout({ title, children }: LayoutProps) {
  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>${title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-P2Z499R4XQ"
        ></script>
        <script>
          ${raw(analytics)}
        </script>
        <script
          src="https://unpkg.com/htmx.org@2.0.4/dist/htmx.min.js"
          defer
        ></script>
      </head>
      <body hx-boost="true">${children}</body>
    </html>`
}
