from sqlalchemy import Float, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime
from app.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.user import User
    from app.models.embedding import ClothingEmbedding


class ClothingItem(Base):
    __tablename__ = "clothing_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default= func.now())
    user_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False
    )
    name: Mapped[str] = mapped_column(String, nullable=False)
    category: Mapped[str] = mapped_column(String, nullable=False)
    color: Mapped[str] = mapped_column(String, nullable=False)
    img: Mapped[str] = mapped_column(String, nullable=False)

    description: Mapped[str] = mapped_column(String, nullable=True)
    material: Mapped[str] = mapped_column(String, nullable=True)
    size: Mapped[str] = mapped_column(String, nullable=True)
    brand: Mapped[str] = mapped_column(String, nullable=True)
    price: Mapped[float] = mapped_column(Float, nullable=True)

    # Relationships
    owner: Mapped["User"] = relationship("User", back_populates="clothing_items")
    embedding: Mapped["ClothingEmbedding"] = relationship(
        "ClothingEmbedding", back_populates="item", uselist=False
    )
