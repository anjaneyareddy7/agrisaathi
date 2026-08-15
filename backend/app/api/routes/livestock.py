from fastapi import APIRouter
from app.data.animal_encyclopedia import ANIMAL_CATEGORIES

router = APIRouter(prefix="/api/livestock-types", tags=["livestock"])


@router.get("")
async def list_livestock_types():
    # Flatten breeds within each category into the shape LivestockCare.jsx expects:
    # { id, name_en, category }
    types = []
    for cat in ANIMAL_CATEGORIES:
        for breed in cat["breeds"]:
            types.append({
                "id": f"{cat['category']}__{breed}".replace(" ", "_"),
                "name_en": breed,
                "category": cat["label"],
            })
    return types
