from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models import User
from app.schemas.clothes import ClothingItemCreate, ClothingItemResponse, ClothingItemUpdate
from app.services import clothing

router = APIRouter()

@router.get("/wardrobe", response_model=list[ClothingItemResponse])
async def get_clothes(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try: 
        response = await clothing.get_all_clothing_items(user_id=user.id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clothing items: {str(e)}")
    return response


@router.get("/wardrobe/{clothing_id}", response_model=ClothingItemResponse)
async def get_clothing(clothing_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        response = await clothing.get_clothing_item(clothing_id=clothing_id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving clothing item: {str(e)}")
    if not response:
        raise HTTPException(status_code=404, detail="Clothing item not found")
    if response.user_id != user.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this clothing item")
    return response


@router.post("/wardrobe", status_code=201, response_model=ClothingItemResponse)
async def create_clothing(item: ClothingItemCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try: 
        clothing_item = await clothing.create_clothing_item(user_id=user.id, clothing=item, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating clothing item: {str(e)}")
    
    return clothing_item

@router.post("/wardrobe/upload", status_code=201, response_model=ClothingItemResponse)
async def upload_clothing(
    file: UploadFile = File(..., description="Upload a clothing item image", media_type="image/*"), 
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    try: 
        clothing_item = await clothing.upload_clothing_item(user_id=user.id, file=file, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error uploading clothing item: {str(e)}")
    return clothing_item

@router.patch("/wardrobe/{clothing_id}", response_model=ClothingItemResponse)
async def update_clothing(clothing_id: int, clothing_update: ClothingItemUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        response = await clothing.update_clothing_item(user_id=user.id, clothing_id=clothing_id, clothing=clothing_update, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating clothing item: {str(e)}")
    return response

@router.delete("/wardrobe/{clothing_id}", status_code=204)
async def delete_clothing(clothing_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    try:
        await clothing.delete_clothing_item(user_id=user.id, clothing_id=clothing_id, db=db)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting clothing item: {str(e)}")
    return