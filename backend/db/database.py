from sqlmodel import SQLModel, Field, Session, create_engine
from typing import Optional
from config import settings
import uuid
from datetime import datetime


class DocumentRecord(SQLModel, table=True):
    __tablename__ = "documents"
    id: Optional[int] = Field(default=None, primary_key=True)
    doc_id: str = Field(index=True)
    filename: str
    file_type: str
    upload_time: str
    chunk_count: int
    session_id: str = Field(index=True)
    file_size_kb: float


class QueryHistoryRecord(SQLModel, table=True):
    __tablename__ = "query_history"
    id: Optional[int] = Field(default=None, primary_key=True)
    query_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: str = Field(index=True)
    question: str
    answer: str
    doc_ids_json: str       # JSON string of list
    sources_json: str       # JSON string of list
    timestamp: str


engine = create_engine(f"sqlite:///{settings.sqlite_db_path}")


def init_db():
    SQLModel.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session
