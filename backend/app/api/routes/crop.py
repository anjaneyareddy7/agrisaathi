from fastapi import APIRouter
from app.schemas.crop import CropRecommendRequest, CropRecommendResponse
from app.services.crop_service import predict_crop

router = APIRouter(prefix="/api/crop", tags=["crop"])

@router.post("/recommend", response_model=CropRecommendResponse)
def recommend_crop(payload: CropRecommendRequest):
    return predict_crop(payload, top_n=3)
