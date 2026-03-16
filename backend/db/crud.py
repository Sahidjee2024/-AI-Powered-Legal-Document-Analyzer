from sqlmodel import Session, select
from db.database import DocumentRecord, QueryHistoryRecord
import json
from datetime import datetime, timezone


# --- Document CRUD ---

def create_document(db: Session, doc_data: dict) -> DocumentRecord:
    record = DocumentRecord(**doc_data)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_documents_by_session(db: Session, session_id: str) -> list[DocumentRecord]:
    return db.exec(select(DocumentRecord).where(DocumentRecord.session_id == session_id)).all()


def get_document_by_id(db: Session, doc_id: str) -> DocumentRecord | None:
    return db.exec(select(DocumentRecord).where(DocumentRecord.doc_id == doc_id)).first()


def delete_document_record(db: Session, doc_id: str) -> bool:
    record = get_document_by_id(db, doc_id)
    if not record:
        return False
    db.delete(record)
    db.commit()
    return True


# --- Query History CRUD ---

def create_query_record(db: Session, record_data: dict) -> QueryHistoryRecord:
    record = QueryHistoryRecord(
        query_id=record_data["query_id"],
        session_id=record_data["session_id"],
        question=record_data["question"],
        answer=record_data["answer"],
        doc_ids_json=json.dumps(record_data["doc_ids"]),
        sources_json=json.dumps(record_data["sources"]),
        timestamp=record_data["timestamp"]
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_queries_by_session(db: Session, session_id: str) -> list[QueryHistoryRecord]:
    return db.exec(
        select(QueryHistoryRecord)
        .where(QueryHistoryRecord.session_id == session_id)
        .order_by(QueryHistoryRecord.timestamp.desc())
    ).all()
