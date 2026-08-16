from pydantic import BaseModel, Field
from typing import List, Optional

class SoilAnalyzeRequest(BaseModel):
    ph_samples: List[float] = Field(..., min_length=1, max_length=15)
    n: Optional[float] = None
    p: Optional[float] = None
    k: Optional[float] = None
    organic_carbon: Optional[float] = None
    ec: Optional[float] = None

class SoilAnalyzeResponse(BaseModel):
    sample_count: int
    avg_ph: float
    min_ph: float
    max_ph: float
    variation: float
    ph_classification: str
    variation_note: str
    suitable_crops: List[str]

class WaterSample(BaseModel):
    ph: Optional[float] = None
    ec: Optional[float] = None

class WaterAnalyzeRequest(BaseModel):
    samples: List[WaterSample] = Field(..., min_length=1, max_length=5)
    tds: Optional[float] = None
    turbidity: Optional[float] = None
    hardness: Optional[float] = None

class WaterAnalyzeResponse(BaseModel):
    sample_count: int
    avg_ph: Optional[float] = None
    avg_ec: Optional[float] = None
    issues: List[str]
