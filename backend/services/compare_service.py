from datetime import datetime, timezone
from sqlmodel import Session
from core.vectorstore import query_chunks
from core.llm import call_llm_structured
from core.prompts import COMPARISON_SYSTEM
from db.crud import get_document_by_id
from models.comparison import ComparisonResult, ComparisonOutput
from fastapi import HTTPException


async def compare_documents(doc1_id: str, doc2_id: str, db: Session) -> ComparisonResult:
    doc1 = get_document_by_id(db, doc1_id)
    doc2 = get_document_by_id(db, doc2_id)
    if not doc1 or not doc2:
        raise HTTPException(404, "One or both documents not found")

    chunks1 = await query_chunks("clauses obligations terms conditions", [doc1_id], top_k=10)
    chunks2 = await query_chunks("clauses obligations terms conditions", [doc2_id], top_k=10)

    text1 = "\n\n".join([c["text"] for c in chunks1])[:3000]
    text2 = "\n\n".join([c["text"] for c in chunks2])[:3000]

    prompt = f"DOCUMENT 1 ({doc1.filename}):\n{text1}\n\nDOCUMENT 2 ({doc2.filename}):\n{text2}\n\nCompare these two documents."
    result = await call_llm_structured(prompt, COMPARISON_SYSTEM, ComparisonOutput)

    return ComparisonResult(
        doc1_id=doc1_id, doc1_filename=doc1.filename,
        doc2_id=doc2_id, doc2_filename=doc2.filename,
        clause_comparisons=result.clause_comparisons,
        overall_summary=result.overall_summary,
        recommendation=result.recommendation,
        compared_at=datetime.now(timezone.utc).isoformat()
    )
