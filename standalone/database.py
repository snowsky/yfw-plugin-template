"""
Optional standalone database.

When DATABASE_URL is empty the application runs fully stateless — no DB tables
are created and get_db yields None. Routers must handle a None session gracefully
(or simply not use the DB in stateless mode).

Set DATABASE_URL in .env to enable persistence (SQLite or Postgres).
"""
from __future__ import annotations

from typing import Generator, Optional

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from standalone.config import get_settings

settings = get_settings()

_engine = None
_SessionLocal = None


class Base(DeclarativeBase):
    pass


def _init_engine():
    global _engine, _SessionLocal
    if not settings.database_url:
        return
    connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {}
    _engine = create_engine(settings.database_url, connect_args=connect_args)
    _SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=_engine)


def create_tables():
    """Create all tables if a database is configured."""
    _init_engine()
    if _engine:
        Base.metadata.create_all(bind=_engine)


def get_db() -> Generator[Optional[Session], None, None]:
    """Yield a DB session, or None if no database is configured."""
    if _SessionLocal is None:
        yield None
        return
    db = _SessionLocal()
    try:
        yield db
    finally:
        db.close()
