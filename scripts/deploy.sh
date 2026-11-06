#!/usr/bin/env bash
# Build and deploy the Worker to Cloudflare.
#
# Usage:
#   ./scripts/deploy.sh              # default environment
#   ./scripts/deploy.sh --env staging
#
# Authentication:
#   By default, uses the Wrangler OAuth session from `pnpm exec wrangler login`.
#   For CI or other non-interactive environments, set both
#   CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID. A git-ignored `.env` file is
#   optional and is only used to provide those two values.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

# API-token auth requires both values. If neither is set, use Wrangler OAuth.
if [[ -n "${CLOUDFLARE_API_TOKEN:-}" || -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
  if [[ -z "${CLOUDFLARE_API_TOKEN:-}" || -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
    echo "error: set both CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID, or neither to use the Wrangler OAuth session." >&2
    exit 1
  fi
else
  if ! pnpm exec wrangler whoami >/dev/null 2>&1; then
    echo "error: Wrangler is not authenticated. Run 'pnpm exec wrangler login' or set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID." >&2
    exit 1
  fi
fi

if [[ ! -d node_modules ]]; then
  echo "==> Installing dependencies"
  pnpm install --frozen-lockfile
fi

echo "==> Building"
pnpm build

echo "==> Deploying"
pnpm exec wrangler deploy "$@"
