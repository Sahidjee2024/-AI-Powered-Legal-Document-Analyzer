import uuid
from datetime import datetime, timezone
from sqlmodel import Session
from core.vectorstore import query_chunks
from core.llm import call_llm
from core.prompts import QA_SYSTEM
from db.crud import create_query_record
from models.session import QueryRecord
from config import settings


async def answer_question(question: str, doc_ids: list[str], session_id: str, db: Session) -> QueryRecord:
    chunks = await query_chunks(question, doc_ids, top_k=settings.top_k_retrieval)

    context_parts = []
    sources = []
    for chunk in chunks:
        meta = chunk["metadata"]
        context_parts.append(f"[Page {meta['page_num']} — {meta['filename']}]\n{chunk['text']}")
        source = f"{meta['filename']} (page {meta['page_num']})"
        if source not in sources:
            sources.append(source)

    context = "\n\n---\n\n".join(context_parts)
    prompt = f"DOCUMENT CONTEXT:\n{context}\n\nQUESTION: {question}\n\nANSWER:"
    answer = await call_llm(prompt, QA_SYSTEM)

    record_data = {
        "query_id": str(uuid.uuid4()),
        "session_id": session_id,
        "question": question,
        "answer": answer,
        "doc_ids": doc_ids,
        "sources": sources,
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
    create_query_record(db, record_data)
    return QueryRecord(**record_data)
