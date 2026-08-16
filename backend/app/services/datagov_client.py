"""
Generic data.gov.in resource fetcher. Every feature route calls this with
a resource key from datagov_resources.DATAGOV_RESOURCES instead of hardcoding
resource IDs or query params.
"""
import httpx
from app.core.config import settings
from app.core.datagov_resources import DATAGOV_RESOURCES

BASE_URL = "https://api.data.gov.in/resource"

DEFAULT_HEADERS = {
    "User-Agent": "AgriSaathi/1.0 (+https://agri-saathi-grow.base44.app)",
}


async def fetch_resource(resource_key: str, filters: dict | None = None, limit: int = 50, offset: int = 0):
    if resource_key not in DATAGOV_RESOURCES:
        raise ValueError(f"Unknown data.gov.in resource key: {resource_key}")

    meta = DATAGOV_RESOURCES[resource_key]
    params = {
        "api-key": settings.data_gov_api_key,
        "format": "json",
        "limit": limit,
        "offset": offset,
    }
    if filters:
        for field, value in filters.items():
            if field in meta["filters"]:
                params[f"filters[{field}]"] = value

    url = f"{BASE_URL}/{meta['resource_id']}"
    async with httpx.AsyncClient(timeout=15, headers=DEFAULT_HEADERS) as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()

    return {
        "resource_key": resource_key,
        "title": meta["title"],
        "total": data.get("total"),
        "count": data.get("count"),
        "records": data.get("records", []),
    }
