# YourFinanceWORKS Plugin Template

A DRY starter for building YFW plugins that run in two modes:

- **Plugin mode** — installed inside a YourFinanceWORKS instance (shares its DB and auth)
- **Standalone mode** — runs as an independent app, connects to YFW via API key

Based on the same pattern as [yfw-crm](https://github.com/snowsky/yfw-crm).

---

## Folder structure

```
├── shared/          # All domain logic — routers, schemas, services
│   ├── compat.py    # Mode-detection shim (plugin vs standalone imports)
│   ├── routers/     # FastAPI routers (used by both modes)
│   └── schemas/     # Pydantic models
│
├── standalone/      # Standalone-specific infrastructure
│   ├── config.py    # Settings (INVOICE_API_URL, INVOICE_API_KEY, storage)
│   ├── auth.py      # API-key validation against YFW
│   ├── database.py  # Optional DB (stateless if DATABASE_URL is empty)
│   └── main.py      # FastAPI entry point
│
├── ui/
│   ├── shared/      # Shared React pages and API client (no duplication)
│   ├── plugin/      # Plugin frontend entry (pluginRoutes, navItems)
│   └── standalone/  # Standalone Vite SPA (@shared alias → ../../ui/shared)
│
├── __init__.py      # Plugin entry: register_plugin(app)
└── plugin.json      # Plugin manifest
```

---

## Quick start

### Standalone mode

```bash
cp .env.example .env
# Edit .env: set INVOICE_API_URL and INVOICE_API_KEY

# Backend
pip install -r requirements.txt
uvicorn standalone.main:app --reload

# Frontend (new terminal)
cd ui/standalone
npm install
npm run dev
```

Visit http://localhost:5173 → Setup page → configure API URL + key → Example page.

### Docker Compose (standalone)

```bash
cp .env.example .env
docker-compose up
```

API at http://localhost:8000 · UI at http://localhost:3000

### Plugin mode (install into YFW)

**Via YFW plugin installer** (recommended):

In YFW settings: Plugins → Install → paste GitHub repo URL.

**Manual install:**

```bash
cd /path/to/invoice_app/api/plugins
git clone https://github.com/your-org/your-plugin my-plugin
# Restart YFW — plugin is auto-discovered
```

---

## Generating an API key (standalone mode)

1. In YourFinanceWORKS: **Settings → API Access → Create Key**
   _(requires the `external_api` license feature)_
2. Copy the `ak_...` key into your `.env` as `INVOICE_API_KEY`

---

## How to use this template

1. **Clone / fork** this repo
2. **Rename** `my-plugin` → your plugin name in:
   - `plugin.json` (`name`, `api_routes`)
   - `__init__.py` (`PLUGIN_PREFIX`, return dict)
   - `standalone/main.py` (`PLUGIN_PREFIX`)
   - `ui/plugin/index.ts` (`pluginMetadata`, route paths)
3. **Replace example files** with your domain logic:
   - `shared/routers/example.py` → your routers
   - `shared/schemas/example.py` → your Pydantic models
   - `ui/shared/pages/ExamplePage.tsx` → your feature pages
4. Update `plugin.json` with your `database_tables` and `api_routes`

---

## DRY mechanism

All shared code lives in `shared/` (Python) and `ui/shared/` (React).

**Backend:** `shared/compat.py` imports from the YFW host app in plugin mode,
or falls back to `standalone/` implementations in standalone mode. Routers
import only from `compat.py` — no mode-specific branching in business logic.

**Frontend:** `ui/standalone/vite.config.ts` sets `@shared → ../../ui/shared`.
`App.tsx` imports pages from `@shared/pages/...`. `ui/plugin/index.ts` also
imports from `../shared/pages/...`. One set of components, two entry points.

---

## Optional features

### Database

Set `DATABASE_URL` in `.env` to enable persistence (SQLite or Postgres).
Leave blank to run fully stateless — `get_db()` yields `None` and routers
must handle that gracefully.

### Cloud storage

Set `STORAGE_BACKEND=s3|azure|gcs` and the corresponding credentials.
Add your upload/download logic in `shared/services/storage.py`.
Files are retained for `FILE_RETENTION_DAYS` days (default: 7).

---

## License

AGPLv3
