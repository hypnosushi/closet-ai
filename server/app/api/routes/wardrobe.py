from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.clothes import ClothingItem
from app.schemas.clothes import ClothingItemCreate, ClothingItemResponse
from app.services.clothing_service import create_clothing_item, get_clothing_item, get_all_clothing_items, upload_clothing_item

router = APIRouter()

@router.get("/wardrobe", response_model=list[ClothingItemResponse])
async def get_clothes(db: Session = Depends(get_db)):
    try: 
        response = await get_all_clothing_items(user_id=1, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clothing items: {str(e)}")
    return response


@router.get("/wardrobe/{clothing_id}", response_model=ClothingItemResponse)
async def get_clothing(clothing_id: int, db: Session = Depends(get_db)):
    try:
        response = await get_clothing_item(clothing_id=clothing_id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clothing item: {str(e)}")
    if not response:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return response


@router.post("/wardrobe", status_code=201, response_model=ClothingItemResponse)
async def create_clothing(clothing: ClothingItemCreate, db: Session = Depends(get_db)):
    try: 
        clothing_item = await create_clothing_item(user_id=1, clothing=clothing, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating clothing item: {str(e)}")
    
    return clothing_item


@router.post("/wardrobe/upload", status_code=201, response_model=ClothingItemResponse)
async def upload_clothing(
    file: UploadFile = File(..., description="Upload a clothing item image", media_type="image/*"), 
    db: Session = Depends(get_db)
):
    try: 
        clothing_item = await upload_clothing_item(user_id=1, file=file, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading clothing item: {str(e)}")
    return clothing_item
    