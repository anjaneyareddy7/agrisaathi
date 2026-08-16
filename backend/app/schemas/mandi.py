from pydantic import BaseModel
from typing import List, Optional

class MandiPriceResponse(BaseModel):
    records: List[dict]
    source: str
    note: Optional[str] = None
