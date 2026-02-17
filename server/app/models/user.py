from sqlalchemy import Integer, String, DateTime, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from app.db.base import Base
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.clothes import ClothingItem

class User(Base):
    __tablename__ = "users"
    
    id : Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email : Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    hashed_password : Mapped[str] = mapped_column(String, nullable=False)
    created_at : Mapped[datetime] = mapped_column(DateTime, default=func.now())

    # Relationships
    clothing_items: Mapped[list["ClothingItem"]] = relationship("ClothingItem", back_populates="owner")