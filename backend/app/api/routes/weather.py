from fastapi import APIRouter, HTTPException, Query
from app.schemas.weather import WeatherResponse
from app.services.weather_service import get_current_weather

router = APIRouter(prefix="/api/weather", tags=["weather"])


@router.get("/current", response_model=WeatherResponse)
async def current_weather(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
):
    try:
        return await get_current_weather(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Failed to fetch weather: {e}")
