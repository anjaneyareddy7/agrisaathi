from fastapi import APIRouter, HTTPException
from app.schemas.translate import TranslateRequest, TranslateResponse
from app.services.translation_service import translate_text

router = APIRouter(prefix="/api/translate", tags=["translate"])


@router.post("", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    try:
        translated = translate_text(req.text, req.target_language)
        return TranslateResponse(translated_text=translated, target_language=req.target_language)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Translate failed: {e}")
