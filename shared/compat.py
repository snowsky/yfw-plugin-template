"""
Compatibility shim — detects whether we are running as a YourFinanceWORKS plugin
(host app imports available) or in standalone mode (own infrastructure).

Usage in shared code:
    from shared.compat import get_db, get_current_user, STANDALONE
"""

try:
    # ── Plugin mode ───────────────────────────────────────────────────────────
    # These modules exist only when installed inside YourFinanceWORKS.
    from core.models.database import get_db           # noqa: F401
    from core.routers.auth import get_current_user    # noqa: F401

    try:
        from core.utils.column_encryptor import EncryptedColumn
        from sqlalchemy import Column

        def encrypted_string(length: int = 500, **kwargs):
            return Column(EncryptedColumn(), **kwargs)
    except ImportError:
        from sqlalchemy import Column, String

        def encrypted_string(length: int = 500, **kwargs):
            return Column(String(length), **kwargs)

    STANDALONE = False

except ImportError:
    # ── Standalone mode ───────────────────────────────────────────────────────
    from standalone.database import get_db            # noqa: F401
    from standalone.auth import get_current_user      # noqa: F401
    from sqlalchemy import Column, String

    def encrypted_string(length: int = 500, **kwargs):
        return Column(String(length), **kwargs)

    STANDALONE = True

__all__ = ["get_db", "get_current_user", "encrypted_string", "STANDALONE"]
