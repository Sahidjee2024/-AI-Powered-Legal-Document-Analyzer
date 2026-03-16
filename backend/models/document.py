from pydantic import BaseModel
from typing import Optional


class DocumentMetadata(BaseModel):
    doc_id: str
    filename: str
    file_type: str
    upload_time: str
    chunk_count: int
    session_id: str
    file_size_kb: float


class DocumentResponse(BaseModel):
    success: bool
    document: DocumentMetadata
    message: str


class DocumentListResponse(BaseModel):
    session_id: str
    documents: list[DocumentMetadata]
    total: int
