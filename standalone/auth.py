"""
Standalone authentication.

Two strategies are supported:

1. API-key forwarding (default, stateless):
   The frontend sends the YourFinanceWORKS API key in the Authorization header.
   This module validates it against the YFW instance and returns a user object.

2. Local JWT (optional):
   For setups where a local user store is needed.
   Enable by setting SECRET_KEY and using the /token endpoint in standalone/main.py.
"""
from __future__ import annotations

from dataclasses import dataclass
from typing import Optional

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader, HTTPAuthorizationCredentials, HTTPBearer

from standalone.config import Settings, get_settings

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)
_bearer = HTTPBearer(auto_error=False)


@dataclass
class StandaloneUser:
    """Minimal user context for standalone mode."""

    id: Optional[int]
    email: str
    api_key: str
    tenant_id: Optional[str] = None


async def get_current_user(
    api_key_header: Optional[str] = Depends(_api_key_header),
    bearer: Optional[HTTPAuthorizationCredentials] = Depends(_bearer),
    settings: Settings = Depends(get_settings),
) -> StandaloneUser:
    """
    Validates the caller's API key against the YFW instance.

    Accepts either:
      - X-API-Key: ak_...
      - Authorization: Bearer ak_...
    """
    key = api_key_header or (bearer.credentials if bearer else None)

    if not key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="API key required. Set X-API-Key header or Authorization: Bearer <key>.",
        )

    # Validate against the YFW instance
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(
                f"{settings.yfw_api_url}/api/v1/external/statements/?limit=1",
                headers={"X-API-Key": key},
                timeout=10.0,
            )
        except httpx.RequestError as exc:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail=f"Cannot reach YourFinanceWORKS at {settings.yfw_api_url}: {exc}",
            )

    if resp.status_code == 401:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid API key.")
    if resp.status_code == 402:
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED,
            detail="External API access not enabled on your YourFinanceWORKS license.",
        )
    if not resp.is_success:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"YFW returned {resp.status_code}.",
        )

    data = resp.json()
    return StandaloneUser(
        id=data.get("user_id"),
        email=data.get("email", ""),
        api_key=key,
        tenant_id=data.get("tenant_id"),
    )
