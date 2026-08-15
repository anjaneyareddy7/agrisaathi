from typing import Optional, List, Dict
from app.data.animal_encyclopedia import ANIMAL_ENCYCLOPEDIA

def list_animals(category: Optional[str] = None, search: Optional[str] = None) -> List[Dict]:
    results = ANIMAL_ENCYCLOPEDIA

    if category:
        results = [a for a in results if a["category"].lower() == category.lower()]

    if search:
        search_lower = search.lower()
        results = [a for a in results if search_lower in a["name_en"].lower()]

    return results

def get_animal_by_name(name: str) -> Optional[Dict]:
    for animal in ANIMAL_ENCYCLOPEDIA:
        if animal["name_en"].lower() == name.lower():
            return animal
    return None

def list_categories() -> List[str]:
    return sorted(set(a["category"] for a in ANIMAL_ENCYCLOPEDIA))
