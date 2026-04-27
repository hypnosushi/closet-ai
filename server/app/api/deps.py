from fastapi import Depends, HTTPException, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.services import auth
from app.db.session import get_db
from app.models import User

# oauth2_scheme will look for the Authorization header and extract the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    try:
        payload = auth.decode_access_token(token)
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials", headers={"WWW-Authenticate": "Bearer"})
    user_id = int(payload.get("sub", 0))
    if user_id == 0:
        raise HTTPException(status_code=401, detail="Invalid user ID in token", headers={"WWW-Authenticate": "Bearer"})
    
    user = auth.get_user_by_id(db=db, user_id=user_id)
    if not user:
        raise HTTPException(status_code=401, detail="User not found", headers={"WWW-Authenticate": "Bearer"})
    return user


def get_rembg_session(request: Request):
    return request.app.state.rembg_session
