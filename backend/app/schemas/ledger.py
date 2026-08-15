from pydantic import BaseModel
from typing import Optional, Dict, Any, List

class LedgerLogRequest(BaseModel):
    entity_type: str          # e.g. "loan_eligibility", "task", "diagnosis_referral", "success_story"
    entity_id: str            # id of the record this event relates to
    event_type: str           # e.g. "created", "matched_to_kvk", "status_changed"
    payload: Dict[str, Any] = {}
    actor: Optional[str] = "system"

class LedgerBlock(BaseModel):
    index: int
    timestamp: str
    entity_type: str
    entity_id: str
    event_type: str
    payload: Dict[str, Any]
    actor: str
    prev_hash: str
    hash: str

class LedgerChainResponse(BaseModel):
    entity_type: str
    entity_id: str
    blocks: List[LedgerBlock]
    valid: bool
