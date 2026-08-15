from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class HelperChatRequest(BaseModel):
    message: str
    language: str = "en"
    context_data: Optional[Dict[str, Any]] = None
    pending_route: Optional[str] = None
    pending_route_name: Optional[str] = None

class HelperChatResponse(BaseModel):
    intent: str
    reply_text: str
    route: Optional[str] = None
    confirm_navigation: bool = False
