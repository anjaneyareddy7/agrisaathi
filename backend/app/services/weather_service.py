import httpx
from app.core.config import settings
from app.schemas.weather import WeatherResponse


async def get_current_weather(lat: float, lon: float) -> WeatherResponse:
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.weather_api_key,
        "units": "metric",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{settings.weather_api_url}/weather", params=params)
        resp.raise_for_status()
        data = resp.json()

    return WeatherResponse(
        location=data.get("name"),
        temperature=data["main"]["temp"],
        feels_like=data["main"].get("feels_like"),
        humidity=data["main"].get("humidity"),
        description=(data.get("weather") or [{}])[0].get("description"),
        icon=(data.get("weather") or [{}])[0].get("icon"),
        wind_speed=data.get("wind", {}).get("speed"),
        rain_1h=data.get("rain", {}).get("1h"),
        lat=lat,
        lon=lon,
    )
