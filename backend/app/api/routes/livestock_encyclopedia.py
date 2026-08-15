from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.livestock_service import list_animals, get_animal_by_name, list_categories

router = APIRouter(prefix="/api/livestock/encyclopedia", tags=["livestock-encyclopedia"])

@router.get("/")
def get_animals(category: Optional[str] = None, search: Optional[str] = None):
    return {"animals": list_animals(category=category, search=search)}

@router.get("/categories")
def get_categories():
    return {"categories": list_categories()}

@router.get("/{name}")
def get_animal(name: str):
    animal = get_animal_by_name(name)
    if not animal:
        raise HTTPException(status_code=404, detail=f"No encyclopedia entry for '{name}'")
    return animal
