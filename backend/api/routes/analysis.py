from fastapi import APIRouter, Depends
from sqlmodel import Session
from db.database import get_session
from services.analysis_service import extract_clauses, flag_risks, generate_summary

router = APIRouter(prefix="/analysis", tags=["Analysis"])


@router.post("/clauses/{doc_id}")
async def clauses(doc_id: str, db: Session = Depends(get_session)):
    return await extract_clauses(doc_id, db)


@router.post("/risks/{doc_id}")
async def risks(doc_id: str, db: Session = Depends(get_session)):
    return await flag_risks(doc_id, db)


@router.post("/summary/{doc_id}")
async def summary(doc_id: str, db: Session = Depends(get_session)):
    return await generate_summary(doc_id, db)
