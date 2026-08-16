from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.services.livestock_service import (
    list_all_entries,
    list_entries_by_category,
    get_entry,
    list_categories,
)

router = APIRouter(prefix="/api/livestock/encyclopedia", tags=["livestock-encyclopedia"])


@router.get("/categories")
def get_categories():
    return {"categories": list_categories()}


@router.get("/entry/{animal_id}")
def get_single_entry(animal_id: str):
    entry = get_entry(animal_id)
    if not entry:
        raise HTTPException(status_code=404, detail=f"No encyclopedia entry for '{animal_id}'")
    return entry


@router.get("/{category_slug}")
def get_category_entries(category_slug: str, search: Optional[str] = Query(None)):
    entries = list_entries_by_category(category_slug)
    if search:
        q = search.lower()
        entries = [e for e in entries if q in e.get("name_en", "").lower()]
    return entries


@router.get("/")
def get_all_entries(search: Optional[str] = Query(None)):
    entries = list_all_entries()
    if search:
        q = search.lower()
        entries = [e for e in entries if q in e.get("name_en", "").lower()]
    return entries
