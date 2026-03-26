"""
Example router — replace with your domain logic.

This file lives in shared/ so it works unchanged in both plugin and standalone modes.
The compat shim (shared/compat.py) provides get_db and get_current_user from the
correct source depending on the deployment mode.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from shared.compat import get_current_user, get_db
from shared.schemas.example import HelloResponse, PluginInfoResponse

router = APIRouter()


@router.get("/hello", response_model=HelloResponse)
def hello(
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Example endpoint — replace with real logic."""
    return HelloResponse(
        message="Hello from the plugin!",
        user=getattr(current_user, "email", str(current_user)),
    )


@router.get("/info", response_model=PluginInfoResponse)
def plugin_info():
    """Returns plugin metadata. No auth required."""
    return PluginInfoResponse(
        name="my-plugin",
        version="1.0.0",
        description="A YourFinanceWORKS plugin template",
    )
