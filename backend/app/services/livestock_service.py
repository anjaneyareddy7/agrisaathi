from app.data.livestock_encyclopedia import LIVESTOCK_ENCYCLOPEDIA, SOURCE_LABEL


def _slug(animal_id: str) -> str:
    # matches the existing /api/livestock-types id convention: "{slug}__{Name}"
    return animal_id.split("__")[0]


def list_categories():
    # Matches the slugs already returned by the live
    # GET /api/livestock/encyclopedia/categories endpoint
    # (apiculture, aquaculture_prawns, dairy, fisheries, poultry, small_ruminants)
    seen = []
    for animal_id in LIVESTOCK_ENCYCLOPEDIA:
        slug = _slug(animal_id)
        if slug not in seen:
            seen.append(slug)
    return seen


def list_entries_by_category(category_slug: str):
    results = []
    for animal_id, entry in LIVESTOCK_ENCYCLOPEDIA.items():
        if _slug(animal_id).lower() == category_slug.lower():
            results.append({"id": animal_id, "source": SOURCE_LABEL, **entry})
    return results


def get_entry(animal_id: str):
    entry = LIVESTOCK_ENCYCLOPEDIA.get(animal_id)
    if entry is None:
        return None
    return {"id": animal_id, "source": SOURCE_LABEL, **entry}


def list_all_entries():
    return [{"id": animal_id, "source": SOURCE_LABEL, **entry} for animal_id, entry in LIVESTOCK_ENCYCLOPEDIA.items()]

