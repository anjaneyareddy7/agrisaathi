from fastapi import APIRouter
from app.data.csv_loader import load_csv

router = APIRouter(prefix="/api/soil-profiles", tags=["soil-profiles"])


@router.get("")
async def list_soil_profiles():
    rows = load_csv("state_soil_profile.csv")
    return [
        {
            "state": r["state_ut"],
            "dominant_soil_type": r["dominant_soil_type"],
            "characteristics": r["characteristics"],
            "typical_ph_range": r["typical_pH_range"],
            "suitable_crops": r["suitable_crops"],
        }
        for r in rows
    ]
