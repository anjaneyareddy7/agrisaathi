from fastapi import APIRouter
from app.data.animal_encyclopedia import ANIMAL_CATEGORIES
from app.schemas.animal_encyclopedia import AnimalEncyclopediaResponse

router = APIRouter(prefix="/api/animal-encyclopedia", tags=["animal-encyclopedia"])


@router.get("", response_model=AnimalEncyclopediaResponse)
async def list_categories():
    return AnimalEncyclopediaResponse(categories=ANIMAL_CATEGORIES, source="reference_data")


@router.get("/{category}", response_model=AnimalEncyclopediaResponse)
async def get_category(category: str):
    matched = [c for c in ANIMAL_CATEGORIES if c["category"] == category]
    return AnimalEncyclopediaResponse(categories=matched, source="reference_data")
