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
