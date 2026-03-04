from fastapi import UploadFile, File
from typing import Optional
from sqlalchemy.orm import Session
from app.models.clothes import ClothingItem
from app.schemas.clothes import ClothingItemCreate, ClothingItemUpdate
from app.services.vision import parse_clothing_img
from app.services.file import save_upload


async def create_clothing_item(
        user_id: int,
        clothing: ClothingItemCreate,
        db: Session,
    ) -> ClothingItem:
        
        """
        Creates a new clothing item manually with provided data   
        """
        clothing_item = ClothingItem(**clothing.model_dump(), user_id=user_id)
        try: 
            db.add(clothing_item)
            db.commit()
            db.refresh(clothing_item)
        except Exception as e:
            db.rollback()
            raise Exception(f"Error creating clothing item: {str(e)}")
        return clothing_item


async def upload_clothing_item(
        user_id: int,
        db: Session,
        file: UploadFile,
    ) -> ClothingItem:
        
        """
        Creates a new clothing item        
        """
        file_path = await save_upload(file)

        metadata = await parse_clothing_img(file_path)

        clothing_item = ClothingItem(
            user_id=user_id,
            img=file_path,
            name=metadata.get("name", "Unknown"),
            category=metadata.get("category", "Unknown"),
            color=metadata.get("color", "Unknown"),
            material=metadata.get("material", "Unknown"),
            size=metadata.get("size", "Unknown"),
            brand=metadata.get("brand", "Unknown"),
        )

        try:
            db.add(clothing_item)
            db.commit()
            db.refresh(clothing_item)
        except Exception as e:
            db.rollback()
            raise Exception(f"Error creating clothing item: {str(e)}")

        return clothing_item


async def get_clothing_item(clothing_id: int, db: Session) -> Optional[ClothingItem]:
    """
    Retrieves a clothing item by ID
    """
    try:
        return db.query(ClothingItem).filter(ClothingItem.id == clothing_id).first()
    except Exception as e:
        raise Exception(f"Error retrieving clothing item: {str(e)}")
    

async def update_clothing_item(user_id: int, clothing_id: int, clothing: ClothingItemUpdate, db: Session) -> Optional[ClothingItem]:
    """
    Updates a clothing item by ID
    """
    try:
        clothing_item = db.query(ClothingItem).filter(ClothingItem.user_id == user_id,ClothingItem.id == clothing_id).first()
        if not clothing_item:
            raise Exception("Clothing item not found")
        for field, value in clothing.model_dump(exclude_unset=True).items():
            setattr(clothing_item, field, value)
        db.commit()
        db.refresh(clothing_item)
        return clothing_item
    except Exception as e:
        db.rollback()
        raise Exception(f"Error updating clothing item: {str(e)}")


async def delete_clothing_item(user_id: int, clothing_id: int, db: Session) -> None:
    """
    Deletes a clothing item by ID
    """
    try:
        clothing_item = db.query(ClothingItem).filter(ClothingItem.user_id == user_id, ClothingItem.id == clothing_id).first()
        if not clothing_item:
            raise Exception("Clothing item not found")
        db.delete(clothing_item)
        db.commit()
    except Exception as e:
        db.rollback()
        raise Exception(f"Error deleting clothing item: {str(e)}")


async def get_all_clothing_items(
          user_id: int, 
          db: Session,
          category: Optional[str] = None) -> list[ClothingItem]:
    """
    Retrieves all clothing items for a user, optionally filtered by category
    """
    query = db.query(ClothingItem).filter(ClothingItem.user_id == user_id)
    if category:
        query = query.filter(ClothingItem.category == category)
    return query.all()