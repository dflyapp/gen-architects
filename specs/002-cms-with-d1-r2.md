# 002 — CMS with Cloudflare D1 + R2

## Status

Implemented — D1 and R2 provisioned, migrations applied locally and remotely,
and the CMS/public-site migration is complete. Production deployment is the
remaining step.

## Goal

Add a small, private CMS at `/cms` so an editor can create and update the
projects shown on the public site.

- Public project pages remain at `/work/:id`.
- Project content is stored in Cloudflare D1 instead of `src/data/model.ts`.
- Uploaded images are stored in Cloudflare R2.
- CMS login uses credentials supplied through environment configuration.
- The existing public design and `/work/:id` presentation should not change.

This document is a plan only. No implementation is included yet.

## Research summary

### Drizzle ORM + D1

Drizzle supports D1 through `drizzle-orm/d1`. The Worker receives the D1
binding and creates a database client per request:

```ts
import { drizzle } from 'drizzle-orm/d1'

const db = drizzle(env.DB, { schema })
```

For schema changes, use Drizzle Kit to generate plain SQL migrations, then let
Wrangler apply them to D1:

```bash
pnpm drizzle-kit generate
pnpm wrangler d1 migrations apply gen-architects-db --local
pnpm wrangler d1 migrations apply gen-architects-db --remote
```

This avoids giving Drizzle Kit direct remote database credentials and keeps
Wrangler as the single tool that applies migrations.

Relevant packages (current versions checked during research):

| Package | Version |
| --- | --- |
| `drizzle-orm` | `^0.45.4` |
| `drizzle-kit` | `^0.31.11` |
| `@cloudflare/workers-types` | `^5.x` |

`drizzle.config.ts` should use:

```ts
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './migrations',
})
```

### D1 constraints

- D1 is SQLite-compatible but does not support every SQLite feature.
- Use integers for booleans (`0`/`1`) and text timestamps to keep behavior
  predictable.
- Foreign keys with `ON DELETE CASCADE` are supported, but D1 does not enforce
  them unless enabled per connection. The application must also delete child
  rows explicitly or enable foreign keys.
- Keep each project update in a single batch/transaction where possible.
- D1 has a 1 MB row limit, so images must never be stored in the database.

### R2

- R2 is accessed through a binding such as `IMAGES`.
- Upload with `env.IMAGES.put(key, file.stream(), { httpMetadata })`.
- Serve uploaded files through the Worker at `/media/*`, or optionally through
  an R2 custom domain/CDN later.
- Store only the object key/URL in D1, never the binary content.
- Local `wrangler dev` emulates R2 on disk under `.wrangler/state`.

### Local development implication

D1 and R2 bindings only exist in the Workers runtime. The current
`tsx src/server.tsx` Node development server cannot provide those bindings
without a second local adapter. The recommended change is:

- Make `wrangler dev` the primary local runtime.
- Keep Tailwind watch running alongside it.
- Retire `src/server.tsx` and `@hono/node-server` unless a Node-only fallback is
  explicitly required.

This gives local behavior that matches production: local D1, local R2, Worker
routing, and `ASSETS` static files.

## Proposed architecture

### New and changed files

```text
drizzle.config.ts
migrations/
  0000_initial.sql
  0001_seed_projects.sql
src/
  app.tsx                    # async D1-backed routes + CMS routes
  worker.tsx                 # Worker entry with typed bindings
  env.ts                     # Bindings/Variables types
  db/
    schema.ts                # Drizzle tables + relations
    queries.ts               # Public project queries
  lib/
    auth.ts                  # Login, session cookie, auth middleware
    password.ts              # Constant-time credential check
    csrf.ts                  # Origin/CSRF validation
    media.ts                 # R2 upload/delete/serve helpers
    validation.ts            # Form parsing and validation
  views/
    Work.tsx                 # receives project from D1
    Home.tsx
    cms/
      Login.tsx
      Dashboard.tsx
      ProjectForm.tsx
      CmsLayout.tsx
  components/
    Carousel.tsx             # receives projects as props
    Footer.tsx               # receives projects as props
```

`src/data/model.ts` should keep only shared types (`Project`, `ProjectImage`,
etc.) and helpers such as `wrap()`. The hard-coded `projects` array is replaced
by seed data.

### Database schema

Use three tables. Packages and images are normalized so ordering and deletion
are straightforward.

#### `projects`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer PK autoincrement | Used by `/work/:id` |
| `name` | text not null | Project title |
| `cover_url` | text not null | `/assets/...` or `/media/...` |
| `cover_key` | text nullable | R2 key when uploaded |
| `cover_desc` | text not null default `''` | Cover caption |
| `category` | text not null | e.g. `HOUSE` |
| `tag` | text not null | e.g. `GEN 16—004` |
| `location` | text not null | Displayed on detail page |
| `description` | text not null | Main project description |
| `published` | integer not null default `0` | Public visibility |
| `sort_order` | integer not null default `0` | Gallery order |
| `created_at` | text not null | ISO string |
| `updated_at` | text not null | ISO string |

#### `project_images`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer PK autoincrement | |
| `project_id` | integer not null | FK → `projects.id` |
| `url` | text not null | `/assets/...` or `/media/...` |
| `r2_key` | text nullable | Present for uploaded images |
| `detail` | text not null default `''` | Caption |
| `sort_order` | integer not null | Matches current five/six image layout |

Add an index on `(project_id, sort_order)`.

#### `project_packages`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | integer PK autoincrement | |
| `project_id` | integer not null | FK → `projects.id` |
| `label` | text not null | e.g. `Concept Design` |
| `sort_order` | integer not null | |

Add an index on `(project_id, sort_order)`.

### Seed migration

Convert the current four projects from `src/data/model.ts` into
`migrations/0001_seed_projects.sql`.

- Preserve existing IDs `1`–`4` so `/work/1` … `/work/4` keep working.
- Seed `published = 1`.
- Keep existing image URLs as `/assets/img/...`; those files remain in
  `src/assets`.
- Seed packages and images in their current order.
- Seed timestamps with a fixed ISO value.

The project data should live in the database after this migration, not in
application code.

### Public routes after migration

| Method | Route | Behavior |
| --- | --- | --- |
| `GET` | `/` | Query published projects, ordered by `sort_order`, pass to `Home` |
| `GET` | `/work/:pid` | Parse numeric ID, query published project + images + packages |
| `GET` | `/partials/carousel?index=N` | Query published projects and render carousel partial |
| `GET` | `/media/*` | Stream the requested object from the `IMAGES` R2 binding |
| `GET` | `/api/hello` | Unchanged |
| `GET` | `/styles.css`, `/assets/*` | Unchanged (Worker `ASSETS` binding) |

Unpublished projects must return the existing 404 page on `/work/:id`.

`Carousel` and `Footer` currently import `projects` directly. Change both to
accept `projects: Project[]` props so the same components work when data comes
from D1.

## CMS routes

All CMS pages render without the public analytics/htmx layout. A dedicated
`CmsLayout` keeps the CMS visually simple and isolated from the marketing site.

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/cms` | Redirect to `/cms/login` if unauthenticated, otherwise dashboard |
| `GET` | `/cms/login` | Login form |
| `POST` | `/cms/login` | Validate credentials, set session cookie, redirect to `/cms` |
| `POST` | `/cms/logout` | Clear session cookie |
| `GET` | `/cms/projects/new` | New project form |
| `POST` | `/cms/projects` | Create project, redirect to edit page |
| `GET` | `/cms/projects/:id/edit` | Edit project, cover, images, packages |
| `POST` | `/cms/projects/:id` | Update project fields |
| `POST` | `/cms/projects/:id/cover` | Upload/replace cover image |
| `POST` | `/cms/projects/:id/images` | Upload one or more gallery images |
| `POST` | `/cms/projects/:id/images/:imageId/delete` | Delete gallery image + R2 object |
| `POST` | `/cms/projects/:id/delete` | Delete project and associated R2 objects |

Use normal HTML forms and POST/Redirect/GET. htmx is not required for the CMS;
plain forms are more predictable for file uploads and partial failures. A
`303 See Other` redirect after every successful mutation prevents duplicate
submissions.

### Project form fields

- `name`, `category`, `tag`, `location`
- `description` (textarea)
- `published` (checkbox)
- `sort_order` (number)
- `package` (textarea, one package item per line)
- Cover: existing cover preview + optional file input
- Gallery images: list existing images with editable captions and order, plus a
  multi-file upload input

For a new project, allow saving without a cover first, then upload the cover on
the edit page. Alternatively require a cover upload during creation. The plan
assumes cover is optional until uploaded, with a placeholder shown in the CMS.

### Image upload rules

- Accepted types: `image/jpeg`, `image/png`, `image/webp`, `image/avif`.
- Maximum file size: 10 MB per image.
- Generate object keys with `crypto.randomUUID()` and a sanitized extension:
  `projects/{projectId}/{uuid}.{ext}`.
- Set R2 `httpMetadata.contentType` and a long-lived `Cache-Control` header.
- Save `url = /media/{key}` and `r2_key = key` in D1.
- On image deletion, delete the D1 row and the R2 object.
- On project deletion, list related `r2_key` values, delete R2 objects, then
  delete the project and child rows.
- On cover replacement, delete the old R2 object after the D1 update succeeds.

`GET /media/*` should return `404` for missing objects and stream the R2 object
body with its stored content type. Because keys are immutable UUIDs, the
response can use `Cache-Control: public, max-age=31536000, immutable`.

## Authentication and security

### Environment configuration

Worker runtime values are not read from `.env` directly. Use:

- `.dev.vars` for local `wrangler dev` runtime secrets (gitignored).
- `.dev.vars.example` as the committed template.
- `wrangler secret put` or the Cloudflare dashboard for production secrets.
- Wrangler CLI authentication defaults to the OAuth session from
  `wrangler login`. For CI or non-interactive environments, set
  `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`; a local `.env` file is
  optional and gitignored.

Required runtime values:

| Name | Kind | Purpose |
| --- | --- | --- |
| `CMS_ADMIN_USER` | var or secret | Login username |
| `CMS_ADMIN_PASSWORD` | secret | Login password |
| `CMS_SESSION_SECRET` | secret | HMAC key for signed session cookies |
| `DB` | D1 binding | Database |
| `IMAGES` | R2 binding | Image storage |
| `ASSETS` | static binding | Existing static files |
| `PUBLIC_MEDIA_BASE_URL` | optional var | If media later moves to a custom domain |

Recommended values for `.dev.vars.example`:

```dotenv
CMS_ADMIN_USER=admin
CMS_ADMIN_PASSWORD=change-me-locally
CMS_SESSION_SECRET=change-me-to-a-long-random-value
```

Production passwords and session secrets must never be committed or placed in
`wrangler.toml`.

### Login/session design

Keep authentication stateless and dependency-free:

1. Compare submitted username/password against `CMS_ADMIN_USER` and
   `CMS_ADMIN_PASSWORD` using a length-safe comparison.
2. On success, issue a cookie named `cms_session`.
3. Cookie payload: `{ sub, exp, nonce }` encoded as base64url.
4. Sign the payload with HMAC-SHA256 using `CMS_SESSION_SECRET` via Web Crypto.
5. Cookie flags: `HttpOnly`, `SameSite=Lax`, `Path=/`, `Secure` when the
   request is HTTPS, `Max-Age` of 12 hours.
6. Verify signature and expiry on every `/cms/*` request.
7. Clear the cookie on logout.

No session table, KV namespace, or Durable Object is needed for a single-editor
CMS.

### CSRF and request safety

- Reject mutating `/cms/*` requests whose `Origin` does not match the request
  host.
- Include a hidden CSRF token in CMS forms, derived from the session nonce and
  `CMS_SESSION_SECRET`; verify it on POST.
- Keep `SameSite=Lax` as defense in depth.
- Return `303` redirects after successful POSTs.
- Do not expose stack traces or D1/R2 errors to the CMS user.

### Rate limiting

Out of scope for this iteration. Note that in-memory rate limiting is not
reliable across Worker isolates. If brute-force protection becomes necessary,
add Cloudflare WAF/rate-limiting rules or a D1-backed attempt counter.

### Credentials

The first iteration intentionally uses a single username/password pair from
environment configuration, as requested. A future iteration can switch to
`CMS_PASSWORD_HASH` (PBKDF2 via Web Crypto) or Cloudflare Access without
changing the rest of the CMS design.

## Worker bindings and configuration

Add to `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "gen-architects-db"
database_id = "<from: wrangler d1 create gen-architects-db>"
migrations_dir = "migrations"

[[r2_buckets]]
binding = "IMAGES"
bucket_name = "gen-architects-media"
```

Add typed bindings in `src/env.ts`:

```ts
export type Bindings = {
  DB: D1Database
  IMAGES: R2Bucket
  ASSETS: Fetcher
  CMS_ADMIN_USER: string
  CMS_ADMIN_PASSWORD: string
  CMS_SESSION_SECRET: string
  PUBLIC_MEDIA_BASE_URL?: string
}

export type Variables = {
  cmsUser: string
}

export type AppEnv = { Bindings: Bindings; Variables: Variables }
```

`createApp()` becomes `new Hono<AppEnv>()`. `src/worker.tsx` exports the Hono
app or a `fetch` wrapper so `env` and `ctx` are passed through.

### Dev/build scripts

Proposed `package.json` changes:

```json
{
  "scripts": {
    "dev": "pnpm build:assets && concurrently \"pnpm dev:css\" \"pnpm dev:worker\"",
    "dev:worker": "wrangler dev",
    "db:generate": "drizzle-kit generate",
    "db:migrate:local": "wrangler d1 migrations apply gen-architects-db --local",
    "db:migrate:remote": "wrangler d1 migrations apply gen-architects-db --remote",
    "preview": "pnpm build && wrangler dev",
    "deploy": "pnpm build && wrangler deploy"
  }
}
```

`src/server.tsx` and `@hono/node-server` are removed if `wrangler dev` becomes
the only local runtime. `dist/` must be staged before `wrangler dev` because the
`ASSETS` binding serves from `./dist`.

## Cloudflare provisioning checklist

These actions require access to the Cloudflare account.

1. Create the D1 database:

   ```bash
   pnpm wrangler d1 create gen-architects-db
   ```

   Copy the returned `database_id` into `wrangler.toml`.

2. Create the R2 bucket:

   ```bash
   pnpm wrangler r2 bucket create gen-architects-media
   ```

3. Ensure the deploy API token has, in addition to the existing Workers
   permissions:
   - Account → D1 → Edit
   - Account → Workers R2 Storage → Edit

   The existing token may only have the “Edit Cloudflare Workers” template,
   which is not sufficient for D1 migrations and R2 bindings.

4. Set production secrets:

   ```bash
   pnpm wrangler secret put CMS_ADMIN_USER
   pnpm wrangler secret put CMS_ADMIN_PASSWORD
   pnpm wrangler secret put CMS_SESSION_SECRET
   ```

5. Apply remote migrations before the first deploy:

   ```bash
   pnpm build
   pnpm db:migrate:remote
   pnpm deploy
   ```

6. Optionally add the CMS secrets as GitHub Actions repository secrets and add
   a migration step to `.github/workflows/deploy.yml` before `wrangler deploy`.
   Secrets only need to be uploaded again when they change.

No custom R2 domain is required initially; `/media/*` is served by the Worker.

## Implementation phases

### Phase 1 — Database foundation

- Add Drizzle packages, config, schema, and migration generation.
- Add D1/R2 bindings and typed Worker env.
- Generate and apply the initial schema locally.
- Add seed migration from the current static project data.
- Verify `wrangler d1 execute` returns the seeded projects.

### Phase 2 — D1-backed public site

- Replace static imports in `/`, `/work/:id`, `/partials/carousel`, `Carousel`,
  and `Footer` with D1 queries/props.
- Keep response markup and styling unchanged.
- Add `/media/*` R2 serving route.
- Verify `/work/1`–`/work/4` still render correctly and unpublished projects
  return 404.

### Phase 3 — Authentication

- Add auth helpers, signed cookie session, login/logout routes, and CSRF/Origin
  checks.
- Add `/cms/login` and a protected `/cms` dashboard.
- Add `.dev.vars.example` and update README/configuration docs.

### Phase 4 — Project CRUD

- Add new/list/edit/delete project forms.
- Add package and image ordering fields.
- Validate all form input server-side.
- Ensure deleting a project cleans up child rows and R2 objects.

### Phase 5 — Image upload and cover management

- Add cover and gallery upload endpoints.
- Add R2 metadata, object key generation, MIME/size validation, and deletion.
- Add previews to the CMS forms.
- Verify uploaded images appear on public work pages via `/media/*`.

### Phase 6 — Deployment and verification

- Switch local dev to `wrangler dev`.
- Update GitHub Actions to apply migrations before deploy.
- Run typecheck/build and a full local CMS smoke test.
- Deploy and verify login, upload, edit, publish/unpublish, and public rendering
  against real D1/R2.

## Acceptance criteria

- `/cms` requires login and cannot be accessed without a valid signed session.
- Valid credentials from the environment allow access; invalid credentials are
  rejected without revealing which field was wrong.
- A CMS user can create a project, edit all current project fields, reorder
  packages/images, upload a cover, upload gallery images, publish/unpublish, and
  delete a project.
- Uploaded files are stored in R2 and served from `/media/*`.
- `/`, `/work/:id`, and the carousel read from D1 and preserve the current
  public design.
- Existing projects 1–4 are available after seeding.
- Unpublished or missing projects return the existing 404 page.
- `pnpm typecheck` and `pnpm build` pass.
- D1/R2 work locally through `wrangler dev` and in production on Cloudflare.
- No credentials or Cloudflare secrets are committed to the repository.

## Open questions / decisions needed

1. **Node development server:** Is it acceptable to retire `pnpm start`
   (`tsx src/server.tsx`) and make `wrangler dev` the only local runtime?
   This is strongly recommended because D1/R2 bindings are Worker-only.
2. **Media domain:** Serve uploads via the Worker at `/media/*` initially, or
   attach a custom R2 domain/CDN now?
3. **Existing images:** Keep them as static `/assets` files (recommended), or
   copy them into R2 during the seed process?
4. **Password storage:** Use the requested plaintext env credential for now, or
   use a hashed password (`CMS_PASSWORD_HASH`) from the start?
5. **Publishing workflow:** Is a simple `published` checkbox sufficient, or is a
   draft/preview URL needed?
6. **Project IDs:** Keep numeric IDs (`/work/1`) or add slugs
   (`/work/59-house`) with numeric IDs retained as redirects?
7. **Extra content fields:** Should the CMS also edit contact/footer/site-wide
   content now, or only projects in this iteration?
