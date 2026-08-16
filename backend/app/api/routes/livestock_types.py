from fastapi import APIRouter
from app.data.csv_loader import load_csv

router = APIRouter(prefix="/api/livestock-types", tags=["livestock-types"])


def _slugify(name: str) -> str:
    return name.strip().lower().replace(" ", "-").replace("/", "-")


@router.get("")
def list_livestock_types():
    rows = load_csv("farm_livestock_types_master.csv")
    return [
        {
            "id": _slugify(r["name_en"]),
            "name_en": r["name_en"],
            "category": r["category"],
            "notes": r.get("notes"),
        }
        for r in rows
    ]
