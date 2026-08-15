from pydantic import BaseModel
from typing import List

class VaccinationEntry(BaseModel):
    age: str
    vaccine: str
    route: str

class AnimalCategory(BaseModel):
    category: str
    label: str
    breeds: List[str]
    vaccination_schedule: List[VaccinationEntry]
    feed: str
    environment: str
    yield_timeline: str

class AnimalEncyclopediaResponse(BaseModel):
    categories: List[AnimalCategory]
    source: str = "reference_data"  # becomes "data.gov.in" once wired to live API
