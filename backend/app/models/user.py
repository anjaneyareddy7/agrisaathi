from sqlalchemy import Column, String, DateTime, Boolean, Enum, Text
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class UserRole(str, enum.Enum):
    FARMER = "farmer"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    uid = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, unique=True)
    full_name = Column(String)
    role = Column(Enum(UserRole), default=UserRole.FARMER)
    preferred_language = Column(String, default="en")
    is_verified = Column(Boolean, default=False)
    profile_picture = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    village = Column(String, nullable=True)
    district = Column(String, nullable=True)
    state = Column(String, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
