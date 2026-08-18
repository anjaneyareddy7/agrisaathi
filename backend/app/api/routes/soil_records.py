from fastapi import APIRouter, Query
from typing import List
from app.schemas.soil_record import SoilRecord, SoilRecordCreate
from app.services.soil_record_service import list_records, create_record

router = APIRouter(prefix="/api/soil-records", tags=["soil-records"])

@router.get("", response_model=List[SoilRecord])
def get_records(order: str = Query("-test_date")):
    return list_records(order)

@router.post("", response_model=SoilRecord)
def add_record(payload: SoilRecordCreate):
    return create_record(payload.model_dump())
