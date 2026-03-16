from fastapi import APIRouter, Depends
from sqlmodel import Session
from db.database import get_session
from api.deps import get_session_id
from models.session import QueryRequest
from services.query_service import answer_question

router = APIRouter(prefix="/query", tags=["Query"])


@router.post("/")
async def query(
    request: QueryRequest,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_session)
):
    return await answer_question(request.question, request.doc_ids, session_id, db)
