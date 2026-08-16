from fastapi import APIRouter, Query
from typing import Optional
from app.data.pest_library import PEST_LIBRARY, LIVESTOCK_VACCINE_LIBRARY, DISCLAIMER

router = APIRouter(prefix="/api/pest-library", tags=["pest-library"])

@router.get("")
def list_pests(type: Optional[str] = Query(None)):
    items = PEST_LIBRARY
    if type:
        items = [p for p in items if p["type"] == type]
    return {"items": items, "disclaimer": DISCLAIMER}

@router.get("/livestock-vaccines")
def list_vaccines(species: Optional[str] = Query(None)):
    items = LIVESTOCK_VACCINE_LIBRARY
    if species:
        items = [v for v in items if v["species"].lower() == species.lower()]
    return {"items": items, "disclaimer": DISCLAIMER}
