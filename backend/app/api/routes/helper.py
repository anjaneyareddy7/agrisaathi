from fastapi import APIRouter, HTTPException
from app.schemas.helper import HelperChatRequest, HelperChatResponse
from app.services.helper_service import handle_chat

router = APIRouter(prefix="/api/helper", tags=["helper"])


@router.post("/chat", response_model=HelperChatResponse)
async def chat(req: HelperChatRequest):
    try:
        return await handle_chat(req)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Helper failed: {e}")
