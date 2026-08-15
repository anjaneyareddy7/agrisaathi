from pydantic import BaseModel
from typing import List

class CropRequirement(BaseModel):
    crop: str
    soil_ph: str
    nitrogen_kg_ha: str
    phosphorus_kg_ha: str
    potassium_kg_ha: str
    moisture: str
    temperature_c: str
    water_requirement: str

class CropRequirementsResponse(BaseModel):
    requirements: List[CropRequirement]
    source: str = "reference_data"
