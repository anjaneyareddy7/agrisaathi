from typing import Optional

from fastapi import APIRouter, HTTPException, Query

from app.core.datagov_registry import RESOURCE_BY_KEY as DATAGOV_RESOURCES
from app.services.datagov_client import fetch_resource

router = APIRouter(
    prefix="/api/data-gov",
    tags=["data-gov"],
)


@router.get("/resources")
async def list_resources():
    resources = []

    for key, meta in DATAGOV_RESOURCES.items():
        resources.append(
            {
                "resource_key": key,
                "resource_id": meta["resource_id"],
                "title": meta["resource_name"],
                "primary_feature": meta.get("primary_feature"),
                "secondary_features": meta.get("secondary_features", []),
                "temporal_status": meta.get("temporal_status", "UNKNOWN"),
            }
        )

    return {
        "count": len(resources),
        "resources": resources,
    }


@router.get("/resources/data")
async def get_resource(
    resource: str = Query(..., min_length=1),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    state: Optional[str] = Query(None),
    district: Optional[str] = Query(None),
    market: Optional[str] = Query(None),
    commodity: Optional[str] = Query(None),
    variety: Optional[str] = Query(None),
    grade: Optional[str] = Query(None),
):
    if resource not in DATAGOV_RESOURCES:
        raise HTTPException(
            status_code=404,
            detail="Requested Data.gov resource is not registered",
        )

    filters = {}

    if state:
        filters["state.keyword"] = state

    if district:
        filters["district"] = district

    if market:
        filters["market"] = market

    if commodity:
        filters["commodity"] = commodity

    if variety:
        filters["variety"] = variety

    if grade:
        filters["grade"] = grade

    try:
        return await fetch_resource(
            resource_key=resource,
            filters=filters,
            limit=limit,
            offset=offset,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=str(exc),
        )


@router.get("/health")
async def data_gov_health():
    from app.core.config import settings

    return {
        "configured": bool(settings.data_gov_api_key),
        "registered_resources": len(DATAGOV_RESOURCES),
    }
