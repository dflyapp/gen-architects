# Gen Architects

Home page for Gen Architects, built with Hono, server-rendered JSX, and htmx.

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

This starts the Hono server on http://localhost:3000 and watches the Tailwind CSS output.

## Production

```bash
pnpm build
pnpm start
```

## Cloudflare Workers

The app deploys to Cloudflare Workers as `gen-architects` and is served at
**https://genarchitechs.net**. Static files are staged into `dist/` and served
through the Workers `ASSETS` binding; server-rendered routes are handled by
`src/worker.tsx`.

The custom domain is configured in `wrangler.toml` with `custom_domain = true`,
so the `genarchitechs.net` zone must be active on the same Cloudflare account.
DNS is provisioned automatically on deploy.

Validate the Worker bundle locally:

```bash
pnpm build
pnpm exec wrangler deploy --dry-run
```

Run the Worker locally:

```bash
pnpm preview
```

Deploy from your machine:

```bash
cp .env.example .env   # then fill in the two values
pnpm deploy
```

### Required GitHub Actions secrets

Add these repository secrets under **Settings → Secrets and variables → Actions**:

| Secret | Description |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | API token with the **Edit Cloudflare Workers** template/permissions |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |

`.github/workflows/deploy.yml` builds the app and deploys on every push to
`main`, or manually via **Run workflow**.

No runtime secrets are currently required. Add Worker runtime secrets with
`wrangler secret put` if needed.

## Node JS Version

v22.20.0 (required by Wrangler 4)
