from pydantic import BaseModel


class TranslateRequest(BaseModel):
    text: str
    target_language: str  # language code, e.g. "te", "hi", "mr"


class TranslateResponse(BaseModel):
    translated_text: str
    target_language: str
