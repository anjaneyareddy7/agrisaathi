"""
Backward-compatible Data.gov.in resource interface.

The authoritative source is datagov_registry.py.
This module keeps the existing DATAGOV_RESOURCES API working.
"""

from .datagov_registry import (
    DATAGOV_REGISTRY,
    RESOURCE_BY_ID,
    RESOURCE_BY_KEY,
    FEATURE_RESOURCES,
    LIVESTOCK_RESOURCE_KEYS,
    get_resource,
    get_resource_by_id,
    get_resources_for_feature,
)


DATAGOV_RESOURCES = {
    resource["resource_key"]: {
        "resource_id": resource["resource_id"],
        "title": resource["resource_name"],
        "primary_feature": resource["primary_feature"],
        "secondary_features": resource["secondary_features"],
        "temporal_status": (
            resource["temporal_status"].value
            if hasattr(resource["temporal_status"], "value")
            else resource["temporal_status"]
        ),
        "filters": [],
    }
    for resource in DATAGOV_REGISTRY
}


# Preserve known filters used by existing endpoints.
KNOWN_FILTERS = {
    "mandi_prices": [
        "state.keyword",
        "district",
        "market",
        "commodity",
        "variety",
        "grade",
    ],
    "variety_market_prices": [
        "State",
        "District",
        "Commodity",
        "Arrival_Date",
    ],
    "soil_moisture": [
        "Year",
        "Month",
        "State",
        "District",
        "Agency_name",
    ],
    "kcc_farmer_queries": [
        "StateName",
        "year",
        "month",
    ],
}


for key, filters in KNOWN_FILTERS.items():
    if key in DATAGOV_RESOURCES:
        DATAGOV_RESOURCES[key]["filters"] = filters


def get_resource_registry():
    return DATAGOV_RESOURCES


def get_resource_by_id_legacy(resource_id):
    resource = RESOURCE_BY_ID.get(resource_id)
    if not resource:
        return None

    return {
        "resource_key": resource["resource_key"],
        "resource_id": resource["resource_id"],
        "title": resource["resource_name"],
        "primary_feature": resource["primary_feature"],
        "secondary_features": resource["secondary_features"],
        "temporal_status": (
            resource["temporal_status"].value
            if hasattr(resource["temporal_status"], "value")
            else resource["temporal_status"]
        ),
        "filters": DATAGOV_RESOURCES[
            resource["resource_key"]
        ]["filters"],
    }
