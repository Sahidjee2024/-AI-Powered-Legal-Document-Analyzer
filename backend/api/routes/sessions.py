from fastapi import APIRouter, Depends
from sqlmodel import Session
from db.database import get_session
from db.crud import get_documents_by_session, get_queries_by_session
from models.session import SessionHistory, QueryRecord
import json

router = APIRouter(prefix="/sessions", tags=["Sessions"])


@router.get("/{session_id}")
def get_session_history(session_id: str, db: Session = Depends(get_session)):
    docs = get_documents_by_session(db, session_id)
    raw_queries = get_queries_by_session(db, session_id)
    queries = [
        QueryRecord(
            query_id=q.query_id,
            session_id=q.session_id,
            question=q.question,
            answer=q.answer,
            doc_ids=json.loads(q.doc_ids_json),
            sources=json.loads(q.sources_json),
            timestamp=q.timestamp
        ) for q in raw_queries
    ]
    return SessionHistory(
        session_id=session_id,
        total_documents=len(docs),
        total_queries=len(queries),
        created_at=docs[0].upload_time if docs else "",
        queries=queries
    )
