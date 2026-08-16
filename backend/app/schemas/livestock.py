from pydantic import BaseModel
from typing import List, Optional, Dict


class VaccinationStep(BaseModel):
    age: str
    vaccine: str


class LivestockEncyclopediaEntry(BaseModel):
    id: str
    category: str
    name_en: str
    purpose: str
    maturity_yield: str
    feed: str
    environment: str
    vaccination_schedule: List[VaccinationStep] = []
    care_notes: Optional[str] = None
    common_risks: List[str] = []
    source: str


class LivestockCategoriesResponse(BaseModel):
    categories: List[str]

