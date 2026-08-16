from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from app.schemas.scheme import SchemeOut, EligibilityCheckRequest, EligibilityCheckResponse
from app.services import scheme_service

router = APIRouter(prefix="/api/schemes", tags=["schemes"])


@router.get("", response_model=List[SchemeOut])
def list_schemes(state: Optional[str] = Query(None, description="e.g. 'telangana' — omit for all-India + all states")):
    return scheme_service.list_schemes(state)


@router.get("/{scheme_id}", response_model=SchemeOut)
def get_scheme(scheme_id: str):
    from app.data.govt_schemes import get_scheme_by_id
    scheme = get_scheme_by_id(scheme_id)
    if scheme is None:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.post("/{scheme_id}/check-eligibility", response_model=EligibilityCheckResponse)
def check_eligibility(scheme_id: str, payload: EligibilityCheckRequest):
    result = scheme_service.check_eligibility(scheme_id, payload)
    if result is None:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return result

