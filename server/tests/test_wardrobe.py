
from app.models.clothes import ClothingItem


def test_get_wardrobe_empty(client):
    response = client.get("/wardrobe")
    assert response.status_code == 200
    assert response.json() == []

def test_get_wardrobe_with_items(client, db, test_user):
    # Create a clothing item in the database
    clothing_item = ClothingItem(
        user_id=test_user.id,
        name="Test Shirt",
        category="Tops",
        color="Blue",
        material="Cotton",
        img="http://example.com/image.jpg"
    )
    db.add(clothing_item)
    db.commit()
    db.refresh(clothing_item)

    response = client.get("/wardrobe")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["name"] == "Test Shirt"

def test_get_clothing_item(client, db, test_user):
    # Create a clothing item in the database
    clothing_item = ClothingItem(
        user_id=test_user.id,
        name="Test Pants",
        category="Bottoms",
        color="Black",
        material="Denim",
        img="http://example.com/pants.jpg"
    )
    db.add(clothing_item)
    db.commit()
    db.refresh(clothing_item)

    response = client.get(f"/wardrobe/{clothing_item.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Pants"

def test_get_clothing_item_not_found(client):
    response = client.get("/wardrobe/999")
    assert response.status_code == 404

def test_create_clothing_item(client, db, test_user):
    clothing_data = {
        "name": "Test Jacket",
        "category": "Outerwear",
        "color": "Red",
        "material": "Leather",
        "size": "M",
        "brand": "Test Brand",
        "price": 99.99
    }
    response = client.post("/wardrobe", json=clothing_data)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Jacket"
    assert "id" in data
    assert "created_at" in data