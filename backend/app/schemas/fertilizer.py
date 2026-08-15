from pydantic import BaseModel, Field
from typing import Optional

class FertilizerCalculateRequest(BaseModel):
    crop: str
    acres: float = Field(..., ge=0)
    guntha: float = Field(0, ge=0, lt=40)
    soil_n: Optional[float] = None
    soil_p: Optional[float] = None
    soil_k: Optional[float] = None
    soil_ph: Optional[float] = None

class NutrientDosage(BaseModel):
    recommended_kg: float
    soil_supplies_kg: float
    dosage_needed_kg: float

class FertilizerCalculateResponse(BaseModel):
    crop: str
    total_area_acres: float
    total_area_hectares: float
    N: NutrientDosage
    P: NutrientDosage
    K: NutrientDosage
    ph_note: Optional[str] = None
    disclaimer: str
