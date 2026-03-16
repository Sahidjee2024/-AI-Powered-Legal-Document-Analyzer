from pydantic import BaseModel
from typing import Literal


class ExtractedClause(BaseModel):
    clause_type: Literal[
        "indemnification", "termination", "liability", "payment",
        "confidentiality", "governing_law", "dispute_resolution",
        "IP_ownership", "auto_renewal", "limitation_of_liability", "other"
    ]
    title: str
    content: str
    page_reference: str
    importance: Literal["critical", "important", "standard"]


class ClauseListWrapper(BaseModel):
    clauses: list[ExtractedClause]


class ClauseExtractionResult(BaseModel):
    doc_id: str
    filename: str
    clauses: list[ExtractedClause]
    total_count: int
    critical_count: int
    extracted_at: str
