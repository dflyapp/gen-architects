# Gen Architects

Home page and CMS for Gen Architects, built with Hono, server-rendered JSX,
htmx, Cloudflare D1, and Cloudflare R2.

The public site is served at **https://genarchitects.net**. Project content is
stored in D1 and uploaded images are stored in R2. The CMS lives at `/cms`.

## Requirements

- Node.js v22.20.0 (see `.nvmrc`)
- pnpm
- A Cloudflare account with access to the `genarchitects.net` zone
- Wrangler authentication (`pnpm exec wrangler login`) or a
  `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` pair

## Getting started

Install dependencies:

```bash
pnpm install
```

Create local Worker runtime secrets:

```bash
cp .dev.vars.example .dev.vars
# then change CMS_ADMIN_USER, CMS_ADMIN_PASSWORD, and CMS_SESSION_SECRET
```

Start local development:

```bash
pnpm dev
```

`pnpm dev` builds the app once, then runs Tailwind in watch mode and
`wrangler dev` together. Open **http://localhost:8787**. The CMS is at
**http://localhost:8787/cms**.

Local development uses the Worker runtime directly, not a Node server. D1 and
R2 bindings only exist inside the Workers runtime, so `wrangler dev` is the only
supported local runtime.

Static assets are staged into `dist/` before `wrangler dev` starts because the
`ASSETS` binding serves from `./dist`. Tailwind watch mode writes
`dist/styles.css` while you work.

## Cloudflare resources

The project uses:

| Resource | Name | Binding |
| --- | --- | --- |
| D1 database | `gen-architects-db` | `DB` |
| R2 bucket | `gen-architects-media` | `IMAGES` |

Provision or verify both resources:

```bash
./scripts/provision.sh
```

The script is idempotent. It creates missing resources, appends missing bindings
to `wrangler.toml`, and verifies existing bindings. It never deletes anything.

The D1 UUID and R2 bucket name are stored in `wrangler.toml` and should be
committed. They are not secrets.

### Database migrations

The schema lives in `src/db/schema.ts`. Drizzle Kit generates plain SQL
migrations into `migrations/`. Wrangler applies them, so Drizzle Kit never needs
remote database credentials.

```bash
# After changing src/db/schema.ts
pnpm db:generate

# Apply to the local simulated database
pnpm db:migrate:local

# Apply to the production database
pnpm db:migrate:remote
```

The seed migration `migrations/0001_seed_projects.sql` restores projects 1–4 so
`/work/1` through `/work/4` keep working.

Local D1/R2 state lives under `.wrangler/state`. Local migrations and remote
migrations are separate; apply both when a migration is added.

### Local R2 media

Uploaded images are stored in R2 and served by the Worker at `/media/*`. Object
keys are immutable UUIDs, so media responses use a long-lived immutable cache
header.

## CMS

The CMS uses a single username/password pair from the Worker environment and a
signed, HttpOnly session cookie.

Local values come from `.dev.vars`:

```dotenv
CMS_ADMIN_USER=admin
CMS_ADMIN_PASSWORD=change-me-locally
CMS_SESSION_SECRET=change-me-to-a-long-random-value
```

Production values are Worker secrets:

```bash
pnpm exec wrangler secret put CMS_ADMIN_USER
pnpm exec wrangler secret put CMS_ADMIN_PASSWORD
pnpm exec wrangler secret put CMS_SESSION_SECRET
```

Never commit `.dev.vars` or place production secrets in `wrangler.toml`.

CMS routes:

| Route | Purpose |
| --- | --- |
| `GET /cms/login` | Login form |
| `POST /cms/login` | Sign in |
| `POST /cms/logout` | Sign out |
| `GET /cms` | Project dashboard |
| `GET /cms/projects/new` | Create a project |
| `POST /cms/projects` | Save a new project |
| `GET /cms/projects/:id/edit` | Edit a project, cover, images, packages |
| `POST /cms/projects/:id` | Save project fields, image captions, and order |
| `POST /cms/projects/:id/cover` | Upload or replace the cover |
| `POST /cms/projects/:id/images` | Upload gallery images |
| `POST /cms/projects/:id/images/:imageId/delete` | Delete a gallery image |
| `POST /cms/projects/:id/delete` | Delete a project and its R2 objects |

## Production

Deploy with your Wrangler OAuth session:

```bash
pnpm run deploy
```

For CI or non-interactive environments, set both `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` in the environment. A git-ignored `.env` file is optional
and is only needed if you want to store those two values locally. The API token
needs:

- Account → Workers Scripts → Edit
- Account → D1 → Edit
- Account → Workers R2 Storage → Edit

Apply remote migrations before deploying new schema-dependent code:

```bash
pnpm db:migrate:remote
pnpm build
pnpm run deploy
```

`pnpm run deploy` runs `scripts/deploy.sh`, which uses the Wrangler OAuth
session by default (or an API token pair when provided), builds the app, and
runs `wrangler deploy`. Use `pnpm run deploy:dry-run` to build and validate the
bundle without publishing.

Validate the Worker bundle without deploying:

```bash
pnpm build
pnpm exec wrangler deploy --dry-run
```

## Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Build once, then run Tailwind watch + `wrangler dev` |
| `pnpm build` | Typecheck, build CSS, and stage static assets |
| `pnpm typecheck` | TypeScript only |
| `pnpm preview` | Build and run `wrangler dev` |
| `pnpm db:generate` | Generate Drizzle SQL migrations |
| `pnpm db:migrate:local` | Apply migrations to local D1 |
| `pnpm db:migrate:remote` | Apply migrations to remote D1 |
| `pnpm run deploy` | Build and deploy with `scripts/deploy.sh` |
| `pnpm run deploy:dry-run` | Build and validate the bundle |
| `./scripts/provision.sh` | Create/verify D1 and R2 resources |

## Node.js version

v22.20.0 is required by Wrangler 4.
