import httpx
import math
import random
from app.core.config import settings
from app.schemas.weather import WeatherResponse, ForecastResponse, ForecastDay, HourlyEntry
from collections import defaultdict
from datetime import datetime, timedelta

# ─────────────────────────────────────────────────────────────
# Offline fallback: a small seasonal climate model for India so
# the app stays useful when the upstream weather API is
# unreachable (rate limit / no network). Marked source="sample".
# ─────────────────────────────────────────────────────────────

_MONTH_MAX = [24, 27, 32, 36, 38, 34, 30, 30, 30, 30, 27, 25]   # typical daily max °C
_MONTH_MIN = [10, 12, 16, 21, 24, 24, 23, 23, 23, 20, 15, 11]   # typical daily min °C

_MONSOON_SKY = [
    ("light rain", 0.30), ("moderate rain", 0.15), ("overcast clouds", 0.20),
    ("scattered clouds", 0.20), ("few clouds", 0.15),
]
_WINTER_SKY = [
    ("clear sky", 0.35), ("few clouds", 0.20), ("haze", 0.30), ("scattered clouds", 0.15),
]
_SUMMER_SKY = [
    ("clear sky", 0.45), ("few clouds", 0.20), ("haze", 0.20), ("scattered clouds", 0.15),
]


def _is_monsoon(month):
    return 6 <= month <= 9


def _sky_table(month):
    if _is_monsoon(month):
        return _MONSOON_SKY
    if month in (11, 12, 1, 2):
        return _WINTER_SKY
    return _SUMMER_SKY


def _pick_sky(rng, month):
    table = _sky_table(month)
    roll, acc = rng.random(), 0.0
    for desc, weight in table:
        acc += weight
        if roll <= acc:
            return desc
    return table[0][0]


def _seed(*parts):
    return random.Random("|".join(str(p) for p in parts))


def _hour_temp(month, hour, rng):
    lo, hi = _MONTH_MIN[month - 1], _MONTH_MAX[month - 1]
    lo += rng.uniform(-1.5, 1.5)
    hi += rng.uniform(-1.5, 1.5)
    # Diurnal curve: coldest ~5am, warmest ~3pm, cooling back overnight.
    warm_phase = ((hour - 5) % 24) / 10.0  # 0 at 5am → 1 at 3pm
    if warm_phase <= 1.0:
        curve = 0.5 - 0.5 * math.cos(warm_phase * math.pi)  # 0 → 1
    else:
        cool_phase = (warm_phase - 1.0) * 10.0 / 14.0       # 3pm → 5am
        curve = 0.5 + 0.5 * math.cos(cool_phase * math.pi)  # 1 → 0
    curve = max(0.0, min(1.0, curve))
    return round(lo + (hi - lo) * curve, 1)


def _sample_current(lat: float, lon: float) -> WeatherResponse:
    now = datetime.now()
    month, hour = now.month, now.hour
    rng = _seed("cur", now.strftime("%Y%m%d%H"), round(lat, 1), round(lon, 1))
    desc = _pick_sky(rng, month)
    temp = _hour_temp(month, hour, rng)
    humidity = rng.randint(70, 92) if _is_monsoon(month) else rng.randint(35, 68)
    feels = round(temp + (2 if humidity > 65 else 1), 1)
    return WeatherResponse(
        location=None,
        temperature=temp,
        feels_like=feels,
        humidity=humidity,
        description=desc,
        icon="sample",
        wind_speed=round(rng.uniform(1.8, 6.5), 1),
        rain_1h=round(rng.uniform(0.2, 2.5), 1) if "rain" in desc else None,
        lat=lat,
        lon=lon,
        source="sample",
    )


def _sample_forecast(lat: float, lon: float) -> ForecastResponse:
    now = datetime.now()
    rng = _seed("fc", now.strftime("%Y%m%d"), round(lat, 1), round(lon, 1))
    month = now.month
    days, hourly = [], []

    for offset in range(5):
        day = now + timedelta(days=offset)
        day_rng = _seed("day", day.strftime("%Y%m%d"), round(lat, 1))
        desc = _pick_sky(day_rng, month)
        hi = _MONTH_MAX[month - 1] + day_rng.uniform(-2, 2)
        lo = _MONTH_MIN[month - 1] + day_rng.uniform(-2, 2)
        pop = day_rng.randint(45, 90) if _is_monsoon(month) else day_rng.randint(5, 30)
        days.append(ForecastDay(
            date=day.strftime("%Y-%m-%d"),
            rain_probability=pop,
            temp_min=round(lo, 1),
            temp_max=round(hi, 1),
            description=desc,
            icon="sample",
        ))

    start = now.replace(minute=0, second=0, microsecond=0)
    for step in range(12):
        ts = start + timedelta(hours=step + 1)
        h_rng = _seed("hr", ts.strftime("%Y%m%d%H"), round(lat, 1))
        hour = ts.hour
        desc = _pick_sky(h_rng, month) if h_rng.random() < 0.6 else days[0].description
        pop = max(0, min(100, days[0].rain_probability + h_rng.randint(-25, 25)))
        hourly.append(HourlyEntry(
            ts=int(ts.timestamp()),
            temp=_hour_temp(month, hour, h_rng),
            rain_probability=pop if "rain" in desc or _is_monsoon(month) else max(0, pop - 30),
            description=desc,
        ))

    return ForecastResponse(
        location=None, lat=lat, lon=lon, days=days, hourly=hourly, source="sample"
    )


# ─────────────────────────────────────────────────────────────
# Live upstream (OpenWeather) with graceful fallback
# ─────────────────────────────────────────────────────────────

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
        # Upstream unreachable — serve seasonal sample data instead of failing.
        return _sample_current(lat, lon)

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
    """5-day forecast + next 12 hours, with sample fallback."""
    params = {
        "lat": lat,
        "lon": lon,
        "appid": settings.weather_api_key,
        "units": "metric",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(f"{settings.weather_api_url}/forecast", params=params)
            resp.raise_for_status()
            data = resp.json()
    except Exception:
        return _sample_forecast(lat, lon)

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

    hourly = [
        HourlyEntry(
            ts=entry["dt"],
            temp=round(entry["main"]["temp"], 1),
            rain_probability=round(entry.get("pop", 0) * 100, 1),
            description=(entry.get("weather") or [{}])[0].get("description", ""),
        )
        for entry in data.get("list", [])[:12]
    ]

    return ForecastResponse(
        location=data.get("city", {}).get("name"),
        lat=lat,
        lon=lon,
        days=days,
        hourly=hourly,
    )
