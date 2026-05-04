from sqlalchemy import Integer, String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from pgvector.sqlalchemy import Vector
from app.db.base import Base
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.models.clothes import ClothingItem

EMBEDDING_DIM = 768  # Gemini Embedding 2 output dimension (smallest)

class ClothingEmbedding(Base):
    def __init__(self, **kwargs):
      kwargs.setdefault("status", "pending")
      super().__init__(**kwargs)
      
    __tablename__ = "clothing_embeddings"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    item_id: Mapped[int] = mapped_column(Integer, ForeignKey("clothing_items.id"), unique=True, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending", nullable=False)  # pending, completed, error
    vector: Mapped[list[float]] = mapped_column(Vector(EMBEDDING_DIM), nullable=True)

    item: Mapped["ClothingItem"] = relationship("ClothingItem", back_populates="embedding")