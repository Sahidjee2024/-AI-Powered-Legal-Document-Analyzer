from fastapi import Header, HTTPException
from db.database import get_session
from sqlmodel import Session
from typing import Annotated, Generator


def get_session_id(x_session_id: Annotated[str | None, Header()] = None) -> str:
    if not x_session_id:
        raise HTTPException(400, "X-Session-ID header is required")
    return x_session_id
