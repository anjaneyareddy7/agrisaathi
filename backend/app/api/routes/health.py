from fastapi import APIRouter

router = APIRouter(tags=["health"])

@router.get("/health")
def health_check():
    return {"status": "ok", "service": "agrisaathi-backend", "version": "1.0.0"}
