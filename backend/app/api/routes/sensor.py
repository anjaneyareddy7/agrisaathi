from fastapi import APIRouter
from app.schemas.sensor import SoilAnalyzeRequest, SoilAnalyzeResponse, WaterAnalyzeRequest, WaterAnalyzeResponse
from app.services.sensor_service import analyze_soil, analyze_water

router = APIRouter(prefix="/api/sensors", tags=["sensors"])

@router.post("/soil/analyze", response_model=SoilAnalyzeResponse)
def soil_analyze(payload: SoilAnalyzeRequest):
    return analyze_soil(payload)

@router.post("/water/analyze", response_model=WaterAnalyzeResponse)
def water_analyze(payload: WaterAnalyzeRequest):
    return analyze_water(payload)
