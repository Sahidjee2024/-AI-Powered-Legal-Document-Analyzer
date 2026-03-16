from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlmodel import Session
from db.database import get_session
from services.compare_service import compare_documents

router = APIRouter(prefix="/compare", tags=["Compare"])


class CompareRequest(BaseModel):
    doc1_id: str
    doc2_id: str


@router.post("/")
async def compare(request: CompareRequest, db: Session = Depends(get_session)):
    return await compare_documents(request.doc1_id, request.doc2_id, db)
