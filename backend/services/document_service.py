import os
import uuid
import aiofiles
from datetime import datetime, timezone
from pathlib import Path
from fastapi import UploadFile, HTTPException
from sqlmodel import Session
from core.ingestion import ingest_document
from core.vectorstore import add_chunks, delete_document_chunks
from db.crud import create_document, get_documents_by_session, delete_document_record, get_document_by_id
from models.document import DocumentMetadata, DocumentResponse, DocumentListResponse
from config import settings

ALLOWED_TYPES = {".pdf", ".docx", ".txt"}


async def upload_document(file: UploadFile, session_id: str, db: Session) -> DocumentResponse:
    suffix = Path(file.filename).suffix.lower()
    if suffix not in ALLOWED_TYPES:
        raise HTTPException(400, f"Unsupported file type: {suffix}. Use PDF, DOCX, or TXT.")

    # Check file size
    contents = await file.read()
    size_kb = len(contents) / 1024
    if size_kb > settings.max_upload_size_mb * 1024:
        raise HTTPException(400, f"File too large. Max size: {settings.max_upload_size_mb}MB")

    doc_id = str(uuid.uuid4())
    doc_dir = os.path.join(settings.upload_dir, doc_id)
    os.makedirs(doc_dir, exist_ok=True)
    file_path = os.path.join(doc_dir, file.filename)

    async with aiofiles.open(file_path, "wb") as f:
        await f.write(contents)

    chunks = ingest_document(file_path, doc_id, file.filename)
    chunk_count = await add_chunks(chunks)

    upload_time = datetime.now(timezone.utc).isoformat()
    doc_data = {
        "doc_id": doc_id,
        "filename": file.filename,
        "file_type": suffix.lstrip("."),
        "upload_time": upload_time,
        "chunk_count": chunk_count,
        "session_id": session_id,
        "file_size_kb": round(size_kb, 2)
    }
    create_document(db, doc_data)

    return DocumentResponse(
        success=True,
        document=DocumentMetadata(**doc_data),
        message=f"Document uploaded successfully. {chunk_count} chunks indexed."
    )


def list_documents(session_id: str, db: Session) -> DocumentListResponse:
    records = get_documents_by_session(db, session_id)
    docs = [DocumentMetadata(
        doc_id=r.doc_id, filename=r.filename, file_type=r.file_type,
        upload_time=r.upload_time, chunk_count=r.chunk_count,
        session_id=r.session_id, file_size_kb=r.file_size_kb
    ) for r in records]
    return DocumentListResponse(session_id=session_id, documents=docs, total=len(docs))


def remove_document(doc_id: str, session_id: str, db: Session) -> dict:
    record = get_document_by_id(db, doc_id)
    if not record:
        raise HTTPException(404, "Document not found")
    if record.session_id != session_id:
        raise HTTPException(403, "Not authorized to delete this document")
    delete_document_chunks(doc_id)
    delete_document_record(db, doc_id)
    return {"success": True, "message": f"Document {doc_id} deleted"}
