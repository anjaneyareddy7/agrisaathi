from pydantic import BaseModel, Field
from typing import Optional, List

class DiagnosisResponse(BaseModel):
    source: str
    model_name: Optional[str] = None
    disease_name: str
    confidence: Optional[float] = Field(default=None, ge=0, le=1)
    description: Optional[str] = None
    symptoms: List[str] = Field(default_factory=list)
    treatment_advice: List[str] = Field(default_factory=list)
    prevention: List[str] = Field(default_factory=list)
    severity: str = "unknown"
    expert_review_required: bool = True
    disclaimer: str
