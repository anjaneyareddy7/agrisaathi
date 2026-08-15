from fastapi import APIRouter
from app.data.crop_requirements import CROP_REQUIREMENTS
from app.schemas.crop_passport import CropRequirementsResponse

router = APIRouter(prefix="/api/crop-passport", tags=["crop-passport"])


@router.get("/requirements", response_model=CropRequirementsResponse)
async def list_requirements():
    return CropRequirementsResponse(requirements=CROP_REQUIREMENTS, source="reference_data")


@router.get("/requirements/{crop_name}", response_model=CropRequirementsResponse)
async def get_requirement(crop_name: str):
    matched = [c for c in CROP_REQUIREMENTS if c["crop"].lower() == crop_name.lower()]
    return CropRequirementsResponse(requirements=matched, source="reference_data")
