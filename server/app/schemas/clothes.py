from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ClothingItemCreate(BaseModel):
    name: str
    category: str
    color: str
    material: str | None
    size: str | None = None
    brand: str | None = None
    price: float | None = None
    img: str | None = None


class ClothingItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    created_at: datetime
    user_id: int
    name: str
    category: str
    color: str
    material: str | None
    img: str | None
    size: str | None = None
    brand: str | None = None
    price: float | None = None
