"""
Standalone configuration — reads from environment / .env file.
In plugin mode this file is never imported (compat.py skips standalone/).
"""
from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # ── YourFinanceWORKS connection ───────────────────────────────────────────
    invoice_api_url: str = "http://localhost:8000"
    invoice_api_key: str = ""

    # ── Auth (standalone JWT) ─────────────────────────────────────────────────
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 h

    # ── Optional database ─────────────────────────────────────────────────────
    # Leave blank to run stateless (no DB required)
    database_url: str = ""

    # ── Optional cloud storage ────────────────────────────────────────────────
    storage_backend: Literal["none", "s3", "azure", "gcs"] = "none"
    file_retention_days: int = 7

    aws_s3_bucket: str = ""
    aws_s3_access_key_id: str = ""
    aws_s3_secret_access_key: str = ""
    aws_s3_region: str = "us-east-1"

    azure_storage_account_name: str = ""
    azure_storage_account_key: str = ""
    azure_storage_container: str = ""

    gcp_bucket_name: str = ""
    gcp_credentials_json: str = ""

    # ── Server ────────────────────────────────────────────────────────────────
    api_port: int = 8000
    cors_origins: list[str] = ["*"]


@lru_cache
def get_settings() -> Settings:
    return Settings()
