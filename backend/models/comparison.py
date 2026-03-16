from pydantic import BaseModel
from typing import Literal


class ClauseComparison(BaseModel):
    clause_type: str
    doc1_content: str | None
    doc2_content: str | None
    difference_summary: str
    risk_delta: Literal["improved", "worsened", "neutral", "missing"]


class ComparisonOutput(BaseModel):
    clause_comparisons: list[ClauseComparison]
    overall_summary: str
    recommendation: str


class ComparisonResult(BaseModel):
    doc1_id: str
    doc1_filename: str
    doc2_id: str
    doc2_filename: str
    clause_comparisons: list[ClauseComparison]
    overall_summary: str
    recommendation: str
    compared_at: str
