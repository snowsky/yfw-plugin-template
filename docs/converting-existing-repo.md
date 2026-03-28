# Converting an Existing Repo into a YFW Plugin

This guide explains what a general repo needs to become installable via the
YourFinanceWORKS plugin manager (`git install`).

## Gap Analysis

| Requirement | General repo | Action |
|---|---|---|
| `plugin.json` at root | Unlikely | Create it |
| Root `__init__.py` with `register_plugin(app)` | No | Create it |
| `plugin/ui/index.ts` exporting `pluginRoutes`, `navItems`, `pluginIcons` | No | Create it |
| Backend routes mountable via `app.include_router(...)` | Maybe | Refactor router |
| Auth via YFW's `get_current_user` / `get_db` | No (own auth) | Use `shared/compat.py` shim |

---

## Step-by-Step Conversion

### 1. Add `plugin.json`

```json
{
  "name": "your-plugin",
  "version": "1.0.0",
  "description": "...",
  "author": "...",
  "license": "AGPLv3",
  "license_tier": "agpl",
  "database_tables": [],
  "api_routes": [],
  "features": []
}
```

### 2. Add root `__init__.py`

Adds the installed directory to `sys.path` so both `plugin/` and `shared/`
are importable as top-level packages.

```python
import sys
from pathlib import Path

_here = Path(__file__).parent
if str(_here) not in sys.path:
    sys.path.insert(0, str(_here))

from plugin.api import register_plugin  # noqa: E402

__all__ = ["register_plugin"]
```

### 3. Create `plugin/api/__init__.py`

Wrap your existing FastAPI router:

```python
from shared.routers import your_router  # adjust import to your structure

PLUGIN_PREFIX = "/api/v1/your-plugin"


def register_plugin(app, mcp_registry=None, feature_gate=None):
    """Called by the YFW plugin loader at startup."""
    app.include_router(your_router, prefix=PLUGIN_PREFIX, tags=["your-plugin"])
    return {
        "name": "your-plugin",
        "version": "1.0.0",
        "routes": [f"{PLUGIN_PREFIX}/..."],
    }
```

For auth and database access, use `shared/compat.py` from the template — it
auto-detects plugin vs standalone mode and provides the correct `get_db` and
`get_current_user` from either the host app or your own standalone setup.

### 4. Create `plugin/ui/index.ts`

Your React page components stay as-is. Add the plugin wiring around them:

```ts
import React from "react";
import type { PluginRouteConfig, PluginNavItem } from "@/types/plugin-routes";
import type { LucideIcon } from "lucide-react";
import { YourIcon } from "lucide-react";

const YourPage = React.lazy(() => import("./pages/YourPage"));

export const pluginMetadata = {
  name: "your-plugin",
  displayName: "Your Plugin",
  version: "1.0.0",
  licenseTier: "agpl",
  description: "...",
};

export const pluginRoutes: PluginRouteConfig[] = [
  {
    path: "/your-plugin",
    component: YourPage,
    pluginId: "your-plugin",
    pluginName: "Your Plugin",
    label: "Your Plugin",
  },
];

export const navItems: PluginNavItem[] = [
  {
    id: "your-plugin",
    path: "/your-plugin",
    label: "Your Plugin",
    icon: "YourIcon",
    priority: 50,
  },
];

// Icons referenced in navItems must be exported here so they are
// merged into the host app's icon registry at runtime.
export const pluginIcons: Record<string, LucideIcon> = {
  YourIcon,
};
```

### 5. Adapt page components

Two things to change in your React pages:

- **Remove own routing** — don't render `<BrowserRouter>` or set up your own
  router; YFW's router is the host and will mount your routes automatically.
- **API calls** — point to `/api/v1/your-plugin/...` and use
  `credentials: "include"` so YFW's cookie-based auth is forwarded:

```ts
const res = await fetch("/api/v1/your-plugin/items", { credentials: "include" });
```

---

## What Stays Unchanged

- Business logic and service layer
- Pydantic schemas
- SQLAlchemy models (register them in `register_plugin` if needed)
- React page component logic

---

## Final Directory Layout

```
your-plugin/
├── __init__.py              ← sys.path shim + re-export register_plugin
├── plugin.json              ← plugin manifest (required by installer)
├── requirements.txt         ← Python dependencies
├── plugin/
│   ├── __init__.py
│   ├── api/
│   │   └── __init__.py      ← register_plugin implementation
│   └── ui/
│       ├── index.ts         ← pluginRoutes, navItems, pluginIcons, pluginMetadata
│       └── pages/
│           └── YourPage.tsx ← self-contained React pages
├── shared/                  ← business logic (works in plugin + standalone)
│   ├── compat.py            ← auto-detects plugin vs standalone mode
│   ├── routers/
│   └── schemas/
└── standalone/              ← standalone deployment (excluded from install)
```

See `yfw-plugin-template` for a working scaffold of this layout.
