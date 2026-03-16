from pydantic import BaseModel
from typing import Optional


class QueryRequest(BaseModel):
    question: str
    doc_ids: list[str]


class QueryRecord(BaseModel):
    query_id: str
    session_id: str
    question: str
    answer: str
    doc_ids: list[str]
    sources: list[str]
    timestamp: str


class SessionHistory(BaseModel):
    session_id: str
    total_documents: int
    total_queries: int
    created_at: str
    queries: list[QueryRecord]
