import { html, raw } from 'hono/html'

export const SITE_NAME = 'Gen Architects'
export const SITE_URL = 'https://genarchitects.net'

export const DEFAULT_TITLE = 'Gen Architects — Residential Architecture & Design'
export const DEFAULT_DESCRIPTION =
  'Gen Architects is a residential architecture studio designing thoughtfully crafted homes. Explore our portfolio of residential projects, architectural designs, and bespoke living spaces.'

export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/svg/logo_picture.svg`

export type LayoutProps = {
  title: string
  description?: string
  canonical?: string
  ogType?: 'website' | 'article'
  ogImage?: string
  ogImageAlt?: string
  noindex?: boolean
  jsonLd?: object | object[]
  children?: unknown
}

const analytics = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){window.dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-P2Z499R4XQ');
`

function jsonLdScript(data: object | object[]): string {
  const items = Array.isArray(data) ? data : [data]
  return items
    .map((item) => JSON.stringify(item))
    .join('\n')
}

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  sameAs: [
    'https://twitter.com/prbarchitects',
    'https://www.instagram.com/prbarchitects/',
  ],
}

export default function Layout({
  title,
  description = DEFAULT_DESCRIPTION,
  canonical,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  noindex = false,
  jsonLd,
  children,
}: LayoutProps) {
  const fullTitle =
    title && title !== SITE_NAME ? `${title} — ${SITE_NAME}` : SITE_NAME
  const canonicalUrl = canonical ?? SITE_URL
  const robots = noindex ? 'noindex, nofollow' : 'index, follow'

  const structuredData: object[] = [organizationJsonLd]
  if (jsonLd) {
    if (Array.isArray(jsonLd)) {
      structuredData.push(...jsonLd)
    } else {
      structuredData.push(jsonLd)
    }
  }

  return html`<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>${fullTitle}</title>
        <meta name="description" content="${description}" />
        <meta name="robots" content="${robots}" />
        <meta name="author" content="${SITE_NAME}" />
        <meta name="theme-color" content="#111111" />
        <link rel="canonical" href="${canonicalUrl}" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />

        <!-- Open Graph -->
        <meta property="og:type" content="${ogType}" />
        <meta property="og:site_name" content="${SITE_NAME}" />
        <meta property="og:title" content="${fullTitle}" />
        <meta property="og:description" content="${description}" />
        <meta property="og:url" content="${canonicalUrl}" />
        <meta property="og:image" content="${ogImage}" />
        ${ogImageAlt ? `<meta property="og:image:alt" content="${ogImageAlt}" />` : ''}

        <!-- Twitter Card -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="${fullTitle}" />
        <meta name="twitter:description" content="${description}" />
        <meta name="twitter:image" content="${ogImage}" />

        <!-- Structured data -->
        ${structuredData.map(
          (item) =>
            `<script type="application/ld+json">${raw(jsonLdScript(item))}</script>`
        )}

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
