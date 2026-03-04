
def test_register_success(auth_client):
    response = auth_client.post("/register", json={"email": "test@example.com", "password": "testpassword"})
    assert response.status_code == 201

def test_register_duplicate_email(auth_client, db):
    #TODO: implement, expect 400 error
    auth_client.post("/register", json={"email": "test@example.com", "password": "testpassword"})
    response = auth_client.post("/register", json={"email": "test@example.com", "password": "testpassword2"})
    assert response.status_code == 400

def test_login_success(auth_client, test_user):
    response = auth_client.post("/login", json={"username": test_user.email, "password": "testpassword"})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["access_token"]

def test_login_wrong_password(auth_client, test_user):
    response = auth_client.post("/login", json={"username": test_user.email, "password": "wrongpassword"})
    assert response.status_code == 401

def test_protected_route_with_valid_token(client, test_user):s
    #TODO: implement
    pass

def test_protected_route_with_invalid_token(client):
    #TODO implement
    pass