"""
Standalone FastAPI entry point.

Run with:
    uvicorn standalone.main:app --reload --port 8000

Or via Docker Compose:
    docker-compose up api
"""
import sys
from pathlib import Path

# Ensure the repo root is on sys.path so shared/ is importable
sys.path.insert(0, str(Path(__file__).parent.parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from shared.routers import example_router
from standalone.config import get_settings
from standalone.database import create_tables

settings = get_settings()

app = FastAPI(
    title="My Plugin — Standalone",
    description="Standalone deployment of the YFW plugin template.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PLUGIN_PREFIX = "/api/v1/my-plugin"

app.include_router(example_router, prefix=PLUGIN_PREFIX, tags=["my-plugin"])


@app.on_event("startup")
async def startup():
    create_tables()


@app.get("/health")
def health():
    return {"status": "ok"}
