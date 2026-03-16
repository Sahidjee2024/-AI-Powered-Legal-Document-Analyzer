from pydantic import BaseModel
from typing import Literal


class RiskFlag(BaseModel):
    risk_level: Literal["high", "medium", "low"]
    risk_category: str
    description: str
    citation: str
    recommendation: str


class RiskListWrapper(BaseModel):
    risks: list[RiskFlag]


class RiskAnalysisResult(BaseModel):
    doc_id: str
    filename: str
    risk_flags: list[RiskFlag]
    overall_risk: Literal["high", "medium", "low"]
    high_count: int
    medium_count: int
    low_count: int
    analyzed_at: str
