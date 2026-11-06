#!/usr/bin/env bash
# Build and deploy the Worker to Cloudflare.
#
# Usage:
#   ./scripts/deploy.sh              # default environment
#   ./scripts/deploy.sh --env staging
#
# Credentials are read from the environment, falling back to `.env`:
#   CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

missing=0
for var in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID; do
  if [[ -z "${!var:-}" ]]; then
    echo "error: $var is not set (export it or add it to .env)" >&2
    missing=1
  fi
done
if [[ $missing -ne 0 ]]; then
  echo "see .env.example" >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  echo "==> Installing dependencies"
  pnpm install --frozen-lockfile
fi

echo "==> Building"
pnpm build

echo "==> Deploying"
pnpm exec wrangler deploy "$@"
