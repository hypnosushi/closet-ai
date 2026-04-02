from app.services.auth import create_access_token
from app.schemas.user import UserCreate

def test_register_success(auth_client):
    user = UserCreate(email="authtest@example.com", password="testpassword")
    response = auth_client.post("/auth/register", json=user.model_dump())
    assert response.status_code == 201

def test_register_duplicate_email(auth_client):
    auth_client.post("/auth/register", json=UserCreate(email="authtest@example.com", password="testpassword").model_dump())
    response = auth_client.post("/auth/register", json=UserCreate(email="authtest@example.com", password="testpassword2").model_dump())
    assert response.status_code == 409 

def test_login_success(auth_client, test_user):
    response = auth_client.post("/auth/login", data={"username": test_user.email, "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["access_token"]

def test_login_wrong_password(auth_client, test_user):
    response = auth_client.post("/auth/login", data={"username": test_user.email, "password": "wrongpassword"})
    assert response.status_code == 401

def test_protected_route_with_valid_token(test_user, auth_client):
    access_token = create_access_token(data={"sub": str(test_user.id)})
    response = auth_client.get(f"/wardrobe", headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 200

def test_protected_route_with_invalid_token(auth_client):
    access_token = create_access_token(data={"sub": "999"})  # Non-existent user ID
    response = auth_client.get(f"/wardrobe", headers={"Authorization": f"Bearer {access_token}"})
    assert response.status_code == 401

def test_cannot_access_other_users_clothing(other_user_item, client):
    response = client.get(f"/wardrobe/{other_user_item.id}")
    assert response.status_code == 403