# 001 — Migrate from Next.js to Hono + JSX + htmx

## Status

Implemented.

## Goal

Replace the Next.js application with a Hono server that renders HTML with
server-side JSX and uses htmx for interactive partial updates.

## Stack

- **Server:** Hono via `@hono/node-server`
- **Templating:** Hono JSX (`hono/jsx`)
- **Interactivity:** htmx
- **Styling:** Tailwind CSS, compiled to `public/styles.css`
- **Runtime/dev tooling:** `tsx`, TypeScript, `concurrently`

## What was implemented

### Hono server

Added `src/server.tsx` as the application entry point.

Routes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/` | Home page with project carousel |
| `GET` | `/work/:pid` | Project detail page |
| `GET` | `/partials/carousel?index=N` | htmx carousel partial |
| `GET` | `/api/hello` | JSON API endpoint preserved from the old project |
| `GET` | `/styles.css` | Compiled Tailwind CSS |
| `GET` | `/assets/*` | Project images and SVGs from `src/assets` |
| `GET` | `/favicon.ico` | Favicon |

Unknown routes return a server-rendered 404 page. Unhandled errors return a
server-rendered 500 page.

### Layout and SSR

Added `src/layout.tsx` as the shared HTML document layout. It includes:

- Page title and viewport metadata
- Tailwind stylesheet
- Google Analytics scripts preserved from the Next.js `_app`
- htmx from `https://unpkg.com/htmx.org@2.0.4`
- `hx-boost="true"` on the body for htmx-powered navigation

### Views

Added:

- `src/views/Home.tsx` — home page
- `src/views/Work.tsx` — project detail page

Both are plain Hono JSX components. No React runtime is used.

### Components

Converted all used components to Hono JSX:

- `src/components/Carousel.tsx`
- `src/components/Contact.tsx`
- `src/components/Footer.tsx`
- `src/components/Image.tsx`
- `src/components/PackageInfo.tsx`

Next.js-specific components and dependencies were removed:

- `next/link` links became regular `<a href="...">` elements
- `next/image` became a lightweight `<img>` wrapper
- `next/head` was replaced by the shared layout title
- `framer-motion` animations were replaced with CSS animations
- `styled-components` styles were replaced with Tailwind classes and CSS

### Project data

Added `src/data/model.ts` containing:

- `Project` and `ProjectImage` types
- The full project data set
- Public asset paths such as `/assets/img/cover1.jpg`
- The carousel `wrap()` helper

The old `src/components/Model.js` asset-import approach was removed.

### htmx carousel

`Carousel.tsx` renders the active project and navigation controls.

- Previous/next buttons request `/partials/carousel?index=N`
- Thumbnail buttons request the same partial for the selected project
- Requests target `#carousel` and use `hx-swap="outerHTML"`
- The server wraps indexes with `wrap()`, so navigation loops correctly
- Carousel transitions are handled by CSS rather than framer-motion

### Static assets and styling

- Hono serves `/assets/*` from `src/assets`
- Tailwind scans `src/**/*.{js,ts,jsx,tsx}`
- Tailwind is compiled into `public/styles.css`
- Added custom CSS animations for carousel fades and page entrance effects
- Added `.work-title` for the project detail heading

### Configuration

Updated:

- `package.json`
  - Removed Next.js/React/framer-motion/styled-components/Sentry-era dependencies
  - Added Hono, Node adapter, `tsx`, and `concurrently`
  - Added `dev`, `dev:css`, `dev:server`, `build`, `build:css`, `start`, and `typecheck` scripts
- `tsconfig.json`
  - Targets ES2022
  - Uses `jsx: "react-jsx"` with `jsxImportSource: "hono/jsx"`
- `.gitignore`
  - Ignores generated `public/styles.css`
- `README.md`
  - Documents Hono development and production commands
- `pnpm-workspace.yaml`
  - Allows the required `esbuild` build script
- `pnpm-lock.yaml`
  - Regenerated for the new dependency graph

## Removed

- `next.config.js`
- `next-env.d.ts`
- `src/pages/_app.tsx`
- `src/pages/_error.jsx`
- `src/pages/index.tsx`
- `src/pages/work/[pid].js`
- `src/pages/api/hello.ts`
- `src/components/*.js`
- `src/components/Model.js`
- `src/components/Post.js`
- `src/utils/index.js`

## Commands

Development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Production start:

```bash
pnpm start
```

## Verification

- `pnpm typecheck` passes
- `pnpm build` passes
- Server smoke-tested:
  - `/` returns the home page
  - `/work/1` returns a project page
  - `/partials/carousel?index=N` returns the correct carousel state
  - `/api/hello` returns JSON
  - `/styles.css` and `/assets/*` return `200`
  - Unknown routes return `404`
