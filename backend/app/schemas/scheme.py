from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class SchemeOut(BaseModel):
    id: str
    name: str
    ministry: str
    state_scope: str
    benefit_summary: str
    eligibility_summary: str
    documents_needed: List[str]
    official_link: str
    source_type: str


class EligibilityCheckRequest(BaseModel):
    owns_land: Optional[bool] = None
    age: Optional[int] = None
    state: Optional[str] = None
    is_income_tax_payer: Optional[bool] = None
    is_govt_employee_above_grade: Optional[bool] = None
    is_institutional_land_holder: Optional[bool] = None
    grows_notified_crop: Optional[bool] = None
    state_participates_pmfby_this_season: Optional[bool] = None


class EligibilityCheckResponse(BaseModel):
    scheme_id: str
    status: str  # "likely_eligible" | "likely_not_eligible" | "needs_more_info"
    matched_rules: Dict[str, Any]
    missing_info: List[str]
    reason: str
    next_steps: str
    disclaimer: str

