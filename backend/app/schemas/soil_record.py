from pydantic import BaseModel
from typing import Optional

class SoilRecordCreate(BaseModel):
    plot_name: str
    test_date: Optional[str] = None
    testing_organization: Optional[str] = None
    soil_type: Optional[str] = None
    ph: Optional[float] = None
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    organic_carbon: Optional[float] = None
    ec: Optional[float] = None
    notes: Optional[str] = None
    card_file_url: Optional[str] = None
    record_hash: Optional[str] = None
    hashed_at: Optional[str] = None

class SoilRecord(SoilRecordCreate):
    id: str
    created_date: str
