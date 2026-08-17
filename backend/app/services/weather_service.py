import httpx
from app.core.config import settings
from app.schemas.weather import WeatherResponse, ForecastResponse, ForecastDay
from collections import defaultdict
from datetime import datetime


async def get_current_weather(lat: float, lon: float) -> WeatherResponse:
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.weather_api_key,
        "units": "metric",
    }
    last_error = None
    for attempt in range(2):
        try:
            async with httpx.AsyncClient(timeout=10) as client:
                resp = await client.get(f"{settings.weather_api_url}/weather", params=params)
                resp.raise_for_status()
                data = resp.json()
            last_error = None
            break
        except Exception as e:
            last_error = e
    if last_error:
        raise last_error

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


async def get_weather_forecast(lat: float, lon: float) -> ForecastResponse:
    """5-day / 3-hour forecast, grouped into daily rain-risk summaries."""
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.weather_api_key,
        "units": "metric",
    }
    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(f"{settings.weather_api_url}/forecast", params=params)
        resp.raise_for_status()
        data = resp.json()

    by_date = defaultdict(list)
    for entry in data.get("list", []):
        date_str = datetime.utcfromtimestamp(entry["dt"]).strftime("%Y-%m-%d")
        by_date[date_str].append(entry)

    days = []
    for date_str, entries in sorted(by_date.items())[:5]:
        max_pop = max((e.get("pop", 0) for e in entries), default=0) * 100
        temps = [e["main"]["temp"] for e in entries]
        mid_entry = entries[len(entries) // 2]
        days.append(ForecastDay(
            date=date_str,
            rain_probability=round(max_pop, 1),
            temp_min=round(min(temps), 1),
            temp_max=round(max(temps), 1),
            description=(mid_entry.get("weather") or [{}])[0].get("description", ""),
            icon=(mid_entry.get("weather") or [{}])[0].get("icon", ""),
        ))

    return ForecastResponse(
        location=data.get("city", {}).get("name"),
        lat=lat,
        lon=lon,
        days=days,
    )
