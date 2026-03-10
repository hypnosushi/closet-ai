from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import Token, UserCreate
from app.services import auth

router = APIRouter(prefix="/auth")

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password", headers={"WWW-Authenticate": "Bearer"})
    
    access_token = auth.create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=Token, status_code=201)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = auth.get_user_by_email(db, email=user.email)
    if existing_user:
        raise HTTPException(status_code=409, detail="Email already registered")
        
    #TODO: validate password strength

    created_user = auth.create_user(db, email=user.email, password=user.password)
    access_token = auth.create_access_token(data={"sub": str(created_user.id)})
    return {"access_token": access_token, "token_type": "bearer"}