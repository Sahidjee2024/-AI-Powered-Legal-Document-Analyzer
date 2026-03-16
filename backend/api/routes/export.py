from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlmodel import Session
from db.database import get_session
from api.deps import get_session_id
from services.export_service import export_to_pdf

router = APIRouter(prefix="/export", tags=["Export"])


@router.get("/{doc_id}")
async def export_pdf(
    doc_id: str,
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_session)
):
    pdf_bytes = await export_to_pdf(doc_id, session_id, db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=analysis_{doc_id}.pdf"}
    )
