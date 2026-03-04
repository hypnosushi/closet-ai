from app.db.base import Base
from app.db.session import engine
import app.models.user
import app.models.clothes

Base.metadata.create_all(bind=engine)

from app.db.session import SessionLocal
from app.models.user import User
from app.models.clothes import ClothingItem
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

DUMMY_USER = {
    "email": "demo@closetai.com",
    "password": "password123",
}

DUMMY_ITEMS = [
    {"name": "White Linen Shirt", "category": "Shirt", "color": "White", "material": "Linen", "brand": "Uniqlo", "price": 39.00, "size": "M", "img": "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400"},
    {"name": "Navy Wool Coat", "category": "Coat", "color": "Navy", "material": "Wool", "brand": "COS", "price": 220.00, "size": "M", "img": "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400"},
    {"name": "Cream Cashmere Sweater", "category": "Sweater", "color": "Cream", "material": "Cashmere", "brand": "Everlane", "price": 130.00, "size": "S", "img": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400"},
    {"name": "Straight Leg Jeans", "category": "Jeans", "color": "Indigo", "material": "Denim", "brand": "Levi's", "price": 89.00, "size": "28", "img": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400"},
    {"name": "Silk Slip Dress", "category": "Dress", "color": "Champagne", "material": "Silk", "brand": "Reformation", "price": 180.00, "size": "S", "img": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400"},
    {"name": "Black Leather Jacket", "category": "Jacket", "color": "Black", "material": "Leather", "brand": "AllSaints", "price": 350.00, "size": "M", "img": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"},
    {"name": "Striped Cotton Tee", "category": "T-Shirt", "color": "Blue/White", "material": "Cotton", "brand": "J.Crew", "price": 45.00, "size": "M", "img": "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400"},
    {"name": "Tailored Trousers", "category": "Pants", "color": "Camel", "material": "Wool", "brand": "Zara", "price": 69.00, "size": "M", "img": "https://images.unsplash.com/photo-1594938298603-c8148c4b4063?w=400"},
]

def seed():
    db = SessionLocal()
    try:
        # Check if demo user already exists
        existing_user = db.query(User).filter(User.email == DUMMY_USER["email"]).first()
        if existing_user:
            print(f"User {DUMMY_USER['email']} already exists, skipping user creation.")
            user = existing_user
        else:
            user = User(
                email=DUMMY_USER["email"],
                hashed_password=pwd_context.hash(DUMMY_USER["password"]),
            )
            db.add(user)
            db.flush()  # get user.id before committing
            print(f"Created user: {user.email}")

        # Only seed items if user has none
        existing_items = db.query(ClothingItem).filter(ClothingItem.user_id == user.id).count()
        if existing_items > 0:
            print(f"User already has {existing_items} items, skipping item seeding.")
        else:
            for item_data in DUMMY_ITEMS:
                item = ClothingItem(user_id=user.id, **item_data)
                db.add(item)
            print(f"Seeded {len(DUMMY_ITEMS)} clothing items.")

        db.commit()
        print("Done!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed()