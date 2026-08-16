from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.livestock import LivestockEncyclopediaEntry, LivestockCategoriesResponse
from app.services import livestock_service

router = APIRouter(prefix="/api/livestock", tags=["livestock"])


@router.get("/encyclopedia/categories", response_model=LivestockCategoriesResponse)
def get_categories():
    return {"categories": livestock_service.list_categories()}


@router.get("/encyclopedia/all", response_model=List[LivestockEncyclopediaEntry])
def get_all_entries():
    return livestock_service.list_all_entries()


@router.get("/encyclopedia/{category}", response_model=List[LivestockEncyclopediaEntry])
def get_entries_by_category(category: str):
    results = livestock_service.list_entries_by_category(category)
    if not results:
        raise HTTPException(status_code=404, detail=f"No encyclopedia entries found for category '{category}'")
    return results


@router.get("/encyclopedia/detail/{animal_id}", response_model=LivestockEncyclopediaEntry)
def get_entry_detail(animal_id: str):
    entry = livestock_service.get_entry(animal_id)
    if entry is None:
        raise HTTPException(status_code=404, detail="Animal not found in encyclopedia")
    return entry

