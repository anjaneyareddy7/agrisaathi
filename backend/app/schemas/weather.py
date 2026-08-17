from pydantic import BaseModel
from typing import Optional

class WeatherResponse(BaseModel):
    location: Optional[str] = None
    temperature: float
    feels_like: Optional[float] = None
    humidity: Optional[int] = None
    description: Optional[str] = None
    icon: Optional[str] = None
    wind_speed: Optional[float] = None
    rain_1h: Optional[float] = None
    lat: float
    lon: float


class ForecastDay(BaseModel):
    date: str
    rain_probability: float  # 0-100, max chance of precipitation that day
    temp_min: float
    temp_max: float
    description: str
    icon: str


class ForecastResponse(BaseModel):
    location: str | None = None
    lat: float
    lon: float
    days: list[ForecastDay]
