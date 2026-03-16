from fastapi import APIRouter, UploadFile, File, Depends
from sqlmodel import Session
from db.database import get_session
from api.deps import get_session_id
from services.document_service import upload_document, list_documents, remove_document

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload")
async def upload(
    file: UploadFile = File(...),
    session_id: str = Depends(get_session_id),
    db: Session = Depends(get_session)
):
    return await upload_document(file, session_id, db)


@router.get("/")
def list_docs(session_id: str = Depends(get_session_id), db: Session = Depends(get_session)):
    return list_documents(session_id, db)


@router.delete("/{doc_id}")
def delete_doc(doc_id: str, session_id: str = Depends(get_session_id), db: Session = Depends(get_session)):
    return remove_document(doc_id, session_id, db)
