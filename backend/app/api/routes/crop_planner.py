from fastapi import APIRouter, HTTPException
from app.schemas.crop_planner import CropPlanRequest, CropPlanResponse
from app.services.crop_planner_service import estimate_crops

router = APIRouter(prefix="/api/crop-planner", tags=["crop-planner"])


@router.post("/estimate", response_model=CropPlanResponse)
async def estimate(req: CropPlanRequest):
    try:
        return await estimate_crops(req)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Crop plan estimate failed: {e}")
