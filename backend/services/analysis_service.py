from datetime import datetime, timezone
from sqlmodel import Session
from core.vectorstore import query_chunks
from core.llm import call_llm_structured, call_llm
from core.prompts import CLAUSE_EXTRACTION_SYSTEM, RISK_FLAGGING_SYSTEM, SUMMARY_SYSTEM
from db.crud import get_document_by_id
from models.clause import ExtractedClause, ClauseExtractionResult, ClauseListWrapper
from models.risk import RiskFlag, RiskAnalysisResult, RiskListWrapper
from fastapi import HTTPException


async def extract_clauses(doc_id: str, db: Session) -> ClauseExtractionResult:
    record = get_document_by_id(db, doc_id)
    if not record:
        raise HTTPException(404, "Document not found")

    chunks = await query_chunks("contract clauses obligations terms", [doc_id], top_k=15)
    full_text = "\n\n".join([c["text"] for c in chunks])

    prompt = f"Extract all clauses from this legal document:\n\n{full_text[:6000]}"
    result = await call_llm_structured(prompt, CLAUSE_EXTRACTION_SYSTEM, ClauseListWrapper)
    clauses = result.clauses

    critical_count = sum(1 for c in clauses if c.importance == "critical")
    return ClauseExtractionResult(
        doc_id=doc_id,
        filename=record.filename,
        clauses=clauses,
        total_count=len(clauses),
        critical_count=critical_count,
        extracted_at=datetime.now(timezone.utc).isoformat()
    )


async def flag_risks(doc_id: str, db: Session) -> RiskAnalysisResult:
    record = get_document_by_id(db, doc_id)
    if not record:
        raise HTTPException(404, "Document not found")

    chunks = await query_chunks("risk liability penalty termination indemnification", [doc_id], top_k=15)
    full_text = "\n\n".join([c["text"] for c in chunks])

    prompt = f"Identify all risks in this legal document:\n\n{full_text[:6000]}"
    result = await call_llm_structured(prompt, RISK_FLAGGING_SYSTEM, RiskListWrapper)
    risks = result.risks

    high = sum(1 for r in risks if r.risk_level == "high")
    medium = sum(1 for r in risks if r.risk_level == "medium")
    low = sum(1 for r in risks if r.risk_level == "low")
    overall = "high" if high > 0 else ("medium" if medium > 0 else "low")

    return RiskAnalysisResult(
        doc_id=doc_id, filename=record.filename,
        risk_flags=risks, overall_risk=overall,
        high_count=high, medium_count=medium, low_count=low,
        analyzed_at=datetime.now(timezone.utc).isoformat()
    )


async def generate_summary(doc_id: str, db: Session) -> dict:
    record = get_document_by_id(db, doc_id)
    if not record:
        raise HTTPException(404, "Document not found")

    chunks = await query_chunks("parties obligations dates payment terms summary", [doc_id], top_k=15)
    full_text = "\n\n".join([c["text"] for c in chunks])

    prompt = f"Summarize this legal document:\n\n{full_text[:6000]}"
    raw = await call_llm(prompt, SUMMARY_SYSTEM)
    import json
    try:
        clean = raw.strip().lstrip("```json").lstrip("```").rstrip("```").strip()
        return {"doc_id": doc_id, "filename": record.filename, "summary": json.loads(clean)}
    except Exception:
        return {"doc_id": doc_id, "filename": record.filename, "summary": {"overall_summary": raw}}
