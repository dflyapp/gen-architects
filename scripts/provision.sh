#!/usr/bin/env bash
# Provision the Cloudflare D1 database and R2 bucket used by Gen Architects.
#
# This script is idempotent:
#   - creates only missing resources
#   - appends missing bindings to wrangler.toml
#   - verifies existing bindings point at the expected resources
#   - never deletes or recreates anything
#
# Usage:
#   ./scripts/provision.sh
#
# Authentication:
#   Reads CLOUDFLARE_API_TOKEN / CLOUDFLARE_ACCOUNT_ID from the environment or
#   .env when set. Otherwise it uses the local Wrangler OAuth session created by
#   `pnpm exec wrangler login`.
#
# Note: Wrangler only auto-updates JSON configs (--update-config), not TOML, so
# this script edits wrangler.toml itself.

set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."

DB_NAME="gen-architects-db"
DB_BINDING="DB"
BUCKET_NAME="gen-architects-media"
BUCKET_BINDING="IMAGES"
CONFIG="wrangler.toml"
MIGRATIONS_DIR="migrations"

info() { printf '==> %s\n' "$*"; }
die() { printf 'error: %s\n' "$*" >&2; exit 1; }

# Load local Cloudflare credentials when present.
if [[ -f .env ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
fi

command -v pnpm >/dev/null 2>&1 || die "pnpm is required"
command -v node >/dev/null 2>&1 || die "node is required"
[[ -f "$CONFIG" ]] || die "$CONFIG not found"

if [[ ! -d node_modules ]]; then
  info "Installing dependencies"
  pnpm install --frozen-lockfile
fi

wrangler() { NO_COLOR=1 pnpm exec wrangler "$@"; }

info "Checking Cloudflare authentication"
if ! wrangler whoami >/dev/null 2>&1; then
  die "Wrangler is not authenticated. Run 'pnpm exec wrangler login' or set CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID."
fi

# Prints the D1 UUID for $DB_NAME, or nothing when it does not exist.
d1_id_for_name() {
  wrangler d1 list --json 2>/dev/null | node -e '
    let input = "";
    process.stdin.on("data", (chunk) => { input += chunk; });
    process.stdin.on("end", () => {
      try {
        const rows = JSON.parse(input);
        const row = rows.find((item) => item.name === process.argv[1]);
        if (row) process.stdout.write(row.uuid || row.id || "");
      } catch {
        process.exitCode = 1;
      }
    });
  ' "$DB_NAME"
}

r2_bucket_exists() {
  wrangler r2 bucket list 2>/dev/null \
    | grep -Eq "^name:[[:space:]]+${BUCKET_NAME}[[:space:]]*$"
}

# Reads a single value from a [[table]] block matching a binding.
# Usage: config_value <table> <binding> <key>
config_value() {
  node - "$CONFIG" "$1" "$2" "$3" <<'NODE'
const fs = require("node:fs");
const [, , configPath, table, binding, key] = process.argv;
const text = fs.readFileSync(configPath, "utf8");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseBlocks(source, tableName) {
  const lines = source.split(/\r?\n/);
  const blocks = [];
  let current = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const header = line.match(/^\s*\[\[([^\]]+)\]\]\s*$/);
    if (header) {
      if (current) {
        current.end = i;
        blocks.push(current);
        current = null;
      }
      if (header[1] === tableName) {
        current = { start: i, end: null, lines: [] };
      }
      continue;
    }

    if (current) {
      if (/^\s*\[/.test(line)) {
        current.end = i;
        blocks.push(current);
        current = null;
      } else {
        current.lines.push(line);
      }
    }
  }

  if (current) {
    current.end = lines.length;
    blocks.push(current);
  }

  return blocks;
}

function valueOf(blockLines, keyName) {
  const pattern = new RegExp("^\\s*" + escapeRegExp(keyName) + "\\s*=\\s*(.*)$");
  for (const line of blockLines) {
    const match = line.match(pattern);
    if (!match) continue;
    let value = match[1].replace(/\s+#.*$/, "").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    return value;
  }
  return null;
}

const block = parseBlocks(text, table).find(
  (item) => valueOf(item.lines, "binding") === binding,
);

if (!block) {
  process.stdout.write("");
} else {
  process.stdout.write(valueOf(block.lines, key) ?? "");
}
NODE
}

# Adds or verifies the D1 and R2 bindings in wrangler.toml.
# Usage: upsert_bindings <d1-id>
upsert_bindings() {
  node - "$CONFIG" "$DB_BINDING" "$DB_NAME" "$1" "$BUCKET_BINDING" "$BUCKET_NAME" "$MIGRATIONS_DIR" <<'NODE'
const fs = require("node:fs");
const [, , configPath, dbBinding, dbName, dbId, r2Binding, r2Name, migrationsDir] =
  process.argv;

let text = fs.readFileSync(configPath, "utf8");

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseBlocks(source, table) {
  const lines = source.split(/\r?\n/);
  const blocks = [];
  let current = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const header = line.match(/^\s*\[\[([^\]]+)\]\]\s*$/);
    if (header) {
      if (current) {
        current.end = i;
        blocks.push(current);
        current = null;
      }
      if (header[1] === table) {
        current = { start: i, end: null, lines: [] };
      }
      continue;
    }

    if (current) {
      if (/^\s*\[/.test(line)) {
        current.end = i;
        blocks.push(current);
        current = null;
      } else {
        current.lines.push({ index: i, text: line });
      }
    }
  }

  if (current) {
    current.end = lines.length;
    blocks.push(current);
  }

  return { lines, blocks };
}

function valueOf(block, key) {
  const pattern = new RegExp("^\\s*" + escapeRegExp(key) + "\\s*=\\s*(.*)$");
  for (const line of block.lines) {
    const match = line.text.match(pattern);
    if (!match) continue;
    let value = match[1].replace(/\s+#.*$/, "").trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
    return value;
  }
  return null;
}

function quote(value) {
  return JSON.stringify(value);
}

function upsert(source, table, binding, values) {
  const { lines, blocks } = parseBlocks(source, table);
  const block = blocks.find((item) => valueOf(item, "binding") === binding);

  if (!block) {
    let next = source;
    if (next.length > 0 && !next.endsWith("\n")) next += "\n";
    next += "\n[[" + table + "]]\n";
    for (const [key, value] of Object.entries(values)) {
      next += key + " = " + quote(value) + "\n";
    }
    console.log("added [[" + table + "]] binding " + binding);
    return next;
  }

  const missing = [];
  for (const [key, value] of Object.entries(values)) {
    const existing = valueOf(block, key);
    if (existing === null) {
      missing.push(key + " = " + quote(value));
    } else if (existing !== value) {
      throw new Error(
        "[[" + table + "]] binding " + binding + " has " + key + " = " +
          JSON.stringify(existing) + ", expected " + JSON.stringify(value) +
          ". Fix " + configPath + " manually.",
      );
    }
  }

  if (missing.length === 0) {
    console.log("verified [[" + table + "]] binding " + binding);
    return source;
  }

  let insertAt = block.end === null ? lines.length : block.end;
  while (insertAt > block.start + 1 && lines[insertAt - 1].trim() === "") {
    insertAt -= 1;
  }
  lines.splice(insertAt, 0, ...missing);
  console.log("updated [[" + table + "]] binding " + binding);
  return lines.join("\n");
}

try {
  text = upsert(text, "d1_databases", dbBinding, {
    binding: dbBinding,
    database_name: dbName,
    database_id: dbId,
    migrations_dir: migrationsDir,
  });
  text = upsert(text, "r2_buckets", r2Binding, {
    binding: r2Binding,
    bucket_name: r2Name,
  });
  fs.writeFileSync(configPath, text);
} catch (error) {
  console.error("error: " + error.message);
  process.exit(1);
}
NODE
}

# --- D1 ---------------------------------------------------------------------

EXISTING_DB_ID="$(d1_id_for_name)" || die "Could not list D1 databases"
CONFIGURED_DB_ID="$(config_value d1_databases "$DB_BINDING" database_id)"
CONFIGURED_DB_NAME="$(config_value d1_databases "$DB_BINDING" database_name)"

if [[ -n "$CONFIGURED_DB_NAME" && "$CONFIGURED_DB_NAME" != "$DB_NAME" ]]; then
  die "$CONFIG has D1 binding '$DB_BINDING' pointing at '$CONFIGURED_DB_NAME', expected '$DB_NAME'. Fix it manually."
fi

if [[ -n "$CONFIGURED_DB_ID" && -z "$EXISTING_DB_ID" ]]; then
  die "$CONFIG references D1 database_id '$CONFIGURED_DB_ID', but no database named '$DB_NAME' exists in this account. Remove or fix the binding before provisioning."
fi

if [[ -z "$EXISTING_DB_ID" ]]; then
  info "Creating D1 database: $DB_NAME"
  wrangler d1 create "$DB_NAME"
  EXISTING_DB_ID="$(d1_id_for_name)" || die "Could not read the new D1 database ID"
  [[ -n "$EXISTING_DB_ID" ]] || die "Created '$DB_NAME' but could not find its ID"
else
  info "D1 database already exists: $DB_NAME ($EXISTING_DB_ID)"
fi

# --- R2 ---------------------------------------------------------------------

CONFIGURED_BUCKET_NAME="$(config_value r2_buckets "$BUCKET_BINDING" bucket_name)"

if [[ -n "$CONFIGURED_BUCKET_NAME" && "$CONFIGURED_BUCKET_NAME" != "$BUCKET_NAME" ]]; then
  die "$CONFIG has R2 binding '$BUCKET_BINDING' pointing at '$CONFIGURED_BUCKET_NAME', expected '$BUCKET_NAME'. Fix it manually."
fi

if r2_bucket_exists; then
  info "R2 bucket already exists: $BUCKET_NAME"
else
  info "Creating R2 bucket: $BUCKET_NAME"
  wrangler r2 bucket create "$BUCKET_NAME"
fi

# --- Wrangler config --------------------------------------------------------

info "Updating $CONFIG"
upsert_bindings "$EXISTING_DB_ID"

info "Provisioning complete"

cat <<EOF

Resources:
  D1  $DB_NAME ($EXISTING_DB_ID), binding $DB_BINDING
  R2  $BUCKET_NAME, binding $BUCKET_BINDING

Next steps:
  1. Generate migrations:  pnpm exec drizzle-kit generate
  2. Apply locally:        pnpm exec wrangler d1 migrations apply $DB_NAME --local
  3. Apply remotely:       pnpm exec wrangler d1 migrations apply $DB_NAME --remote
  4. Set production secrets:
       pnpm exec wrangler secret put CMS_ADMIN_USER
       pnpm exec wrangler secret put CMS_ADMIN_PASSWORD
       pnpm exec wrangler secret put CMS_SESSION_SECRET
  5. Build and deploy:     pnpm build && pnpm run deploy

Local \`wrangler dev\` uses its own simulated D1/R2 state under .wrangler/state,
so migrations must be applied separately to local and remote.
EOF
