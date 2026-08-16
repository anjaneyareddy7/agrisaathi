from fastapi import APIRouter
from app.data.livestock_details import LIVESTOCK_DETAILS
from app.data.csv_loader import load_csv

router = APIRouter(prefix="/api/livestock/details", tags=["livestock-details"])

@router.get("/{name}")
def get_detail(name: str):
    if name in LIVESTOCK_DETAILS:
        return {"name": name, "detail_level": "full", **LIVESTOCK_DETAILS[name]}
    rows = load_csv("farm_livestock_types_master.csv")
    match = next((r for r in rows if r.get("name_en") == name), None)
    if match:
        return {
            "name": name,
            "detail_level": "basic",
            "category": match.get("category"),
            "description": match.get("notes"),
            "note": "Detailed breeding, feed, and vaccination schedule not yet curated for this breed.",
        }
    return {"name": name, "detail_level": "not_found"}
