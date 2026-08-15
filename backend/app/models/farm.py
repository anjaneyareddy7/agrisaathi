from sqlalchemy import Column, String, Float, DateTime, Text, ForeignKey
from sqlalchemy.sql import func
from app.core.database import Base

class Farm(Base):
    __tablename__ = "farms"
    id = Column(String, primary_key=True)
    owner_id = Column(String, ForeignKey("users.id"))
    plot_name = Column(String)
    state = Column(String, nullable=True)
    district = Column(String, nullable=True)
    village = Column(String, nullable=True)
    geo_lat = Column(Float, nullable=True)
    geo_lng = Column(Float, nullable=True)
    area_value = Column(Float, nullable=True)
    area_unit = Column(String, default="acre")
    soil_type = Column(String, nullable=True)
    current_crop = Column(String, nullable=True)
    farm_type = Column(String, default="crop")
    created_at = Column(DateTime, server_default=func.now())

class CropBatch(Base):
    __tablename__ = "crop_batches"
    id = Column(String, primary_key=True)
    farm_id = Column(String, ForeignKey("farms.id"))
    plot_name = Column(String)
    crop_name = Column(String)
    sowing_date = Column(DateTime, nullable=True)
    expected_harvest_date = Column(DateTime, nullable=True)
    status = Column(String, default="planned")
    created_at = Column(DateTime, server_default=func.now())
