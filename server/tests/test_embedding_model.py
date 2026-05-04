from app.models.embedding import ClothingEmbedding

def test_clothing_embedding_has_expected_columns():
    cols = {c.key for c in ClothingEmbedding.__table__.columns}
    assert "id" in cols
    assert "item_id" in cols
    assert "status" in cols
    assert "vector" in cols

def test_clothing_embedding_default_status():
    embedding = ClothingEmbedding(item_id=1)
    assert embedding.status == "pending"
    