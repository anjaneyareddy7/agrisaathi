from sqlalchemy import Column, String, Float, Boolean
from app.core.database import Base

class Crop(Base):
    __tablename__ = "crops"
    id = Column(String, primary_key=True)
    name = Column(String, unique=True, index=True)
    category = Column(String)
    season = Column(String)
    duration_days = Column(String, nullable=True)
    water_requirement = Column(String)
    is_active = Column(Boolean, default=True)
