from fastapi import APIRouter
from app.data.csv_loader import load_csv

router = APIRouter(prefix="/api/gov-markets", tags=["gov-markets"])


@router.get("")
async def list_gov_markets():
    rows = load_csv("gov_market_starter.csv")
    return [
        {
            "state": r["state"],
            "market_name": r["market_name"],
            "district_region": r["district_region"],
            "lat": float(r["lat_approx"]) if r["lat_approx"] else None,
            "lng": float(r["lng_approx"]) if r["lng_approx"] else None,
            "commodities_traded": r["commodities_traded"],
            "verified": False,
        }
        for r in rows
    ]
