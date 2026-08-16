from fastapi import APIRouter
from app.data.csv_loader import load_csv

router = APIRouter(prefix="/api/kvk", tags=["kvk"])


@router.get("")
async def list_kvks(state: str = None):
    rows = load_csv("kvk_full_directory.csv")
    if state:
        rows = [r for r in rows if r["state_ut"].lower() == state.lower()]
    return [
        {
            "state": r["state_ut"],
            "serial_no": r["serial_no"],
            "address": r["address_raw"],
            "host_institution": r["host_organization"],
            "year_of_sanction": r["year_of_sanction"] or None,
            "type": r["type"] or None,
            "verified": False,
            "verify_at": "kvk.icar.gov.in",
        }
        for r in rows
    ]
