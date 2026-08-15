from pydantic import BaseModel, Field
from typing import List

class CropRecommendRequest(BaseModel):
    N: float = Field(..., ge=0, le=200)
    P: float = Field(..., ge=0, le=200)
    K: float = Field(..., ge=0, le=200)
    temperature: float = Field(..., ge=-10, le=60)
    humidity: float = Field(..., ge=0, le=100)
    ph: float = Field(..., ge=0, le=14)
    rainfall: float = Field(..., ge=0, le=5000)

class CropPrediction(BaseModel):
    crop: str
    confidence: float

class CropRecommendResponse(BaseModel):
    top_prediction: str
    recommendations: List[CropPrediction]
