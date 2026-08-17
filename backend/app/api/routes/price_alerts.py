from fastapi import APIRouter
from app.services.price_history_service import compute_price_alerts

router = APIRouter(prefix="/api/price-alerts", tags=["price-alerts"])


@router.get("")
async def price_alerts():
    return {"alerts": compute_price_alerts()}
