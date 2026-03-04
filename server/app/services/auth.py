from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from app.core.config import settings
from sqlalchemy.orm import Session
from app.models.user import User

ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(plain: str) -> str:
    """Hash a plaintext password."""
    return ctx.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plaintext password against a hashed password."""
    return ctx.verify(plain, hashed)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET, algorithm=settings.ALGORITHM)

def decode_access_token(token: str) -> dict:
    """Decode a JWT access token."""
    try:
        payload = jwt.decode(token, settings.SECRET, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Invalid token")
    
def get_user_by_email(db: Session, email: str) -> User | None:
    """Retrieve a user by email."""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Retrieve a user by ID."""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, email: str, password: str) -> User:
    """Create a new user with hashed password."""
    hashed_password = hash_password(password)
    user = User(email=email, hashed_password=hashed_password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def authenticate_user(db: Session, email: str, password: str) -> User | None:
    """Authenticate a user by email and password."""
    user = get_user_by_email(db, email)
    if user and verify_password(password, user.hashed_password):
        return user
    return None