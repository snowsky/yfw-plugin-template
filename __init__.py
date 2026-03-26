"""
YourFinanceWORKS plugin entry point.

When installed as a plugin (cloned into api/plugins/<name>/),
the YFW plugin loader calls register_plugin(app) to mount routes.
"""
from shared.routers import example_router

PLUGIN_PREFIX = "/api/v1/my-plugin"


def register_plugin(app, mcp_registry=None, feature_gate=None):
    """Called by YourFinanceWORKS plugin loader at startup."""
    app.include_router(example_router, prefix=PLUGIN_PREFIX, tags=["my-plugin"])

    return {
        "name": "my-plugin",
        "version": "1.0.0",
        "routes": [f"{PLUGIN_PREFIX}/hello"],
    }
