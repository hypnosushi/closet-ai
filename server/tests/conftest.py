import pytest
from sqlalchemy import create_engine
from app.models.user import User
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app.models import Base
from app.main import app
from app.db.session import get_db

TEST_DATABASE_URL = "postgresql+psycopg2://postgres:postgres@127.0.0.1:5433/closet_ai_test"

engine = create_engine(TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    yield session
    session.rollback()
    session.close()
    Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        yield db

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture(scope="function")
def test_user(db):
    """Creates a user with id=1 since wardrobe routes hardcode user_id=1."""
    user = User(
        email="test@example.com",
        hashed_password="fakehash",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user