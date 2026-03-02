from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.clothes import ClothingItem
from app.schemas.clothes import ClothingItemCreate, ClothingItemResponse, ClothingItemUpdate
from app.services import clothing_service

router = APIRouter()

@router.get("/wardrobe", response_model=list[ClothingItemResponse])
async def get_clothes(db: Session = Depends(get_db)):
    try: 
        response = await clothing_service.get_all_clothing_items(user_id=1, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clothing items: {str(e)}")
    return response


@router.get("/wardrobe/{clothing_id}", response_model=ClothingItemResponse)
async def get_clothing(clothing_id: int, db: Session = Depends(get_db)):
    try:
        response = await clothing_service.get_clothing_item(clothing_id=clothing_id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clothing item: {str(e)}")
    if not response:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    return response


@router.post("/wardrobe", status_code=201, response_model=ClothingItemResponse)
async def create_clothing(clothing: ClothingItemCreate, db: Session = Depends(get_db)):
    try: 
        clothing_item = await clothing_service.create_clothing_item(user_id=1, clothing=clothing, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating clothing item: {str(e)}")
    
    return clothing_item

@router.patch("/wardrobe/{clothing_id}", response_model=ClothingItemResponse)
async def update_clothing(clothing_id: int, clothing_update: ClothingItemUpdate, db: Session = Depends(get_db)):
    try:
        response = await clothing_service.update_clothing_item(user_id=1, clothing_id=clothing_id, clothing=clothing_update, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating clothing item: {str(e)}")
    return response

@router.delete("/wardrobe/{clothing_id}", status_code=204)
async def delete_clothing(clothing_id: int, db: Session = Depends(get_db)):
    try:
        await clothing_service.delete_clothing_item(user_id=1, clothing_id=clothing_id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting clothing item: {str(e)}")
    return