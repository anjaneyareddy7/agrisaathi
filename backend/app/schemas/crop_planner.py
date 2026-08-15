from pydantic import BaseModel
from typing import Optional, List

class CropPlanRequest(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None
    water: str = "medium"
    season: Optional[str] = None
    soil_context: Optional[str] = None
    water_context: Optional[str] = None
    crop_names: List[str]

class CropEstimate(BaseModel):
    name: str
    cost: str
    revenue: str
    margin: str
    note: str

class CropPlanResponse(BaseModel):
    crops: List[CropEstimate]
