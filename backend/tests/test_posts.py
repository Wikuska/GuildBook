from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models import Post, PostLike, User
from app.models.post import PostVisibleRace

def test_create_post_success(authorized_client: TestClient, db_session: Session):
    payload = {
        "title": "How to kill a griffin?",
        "content": "Use the crossbow and silver sword.",
        "category_id": 1,
        "tag_ids": [],
        "visible_race_ids": []
    }
    response = authorized_client.post("/posts/", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "How to kill a griffin?"
    assert data["category"]["id"] == 1
    
    post_id = data["id"]
    post_in_db = db_session.query(Post).filter(Post.id == post_id).first()
    assert post_in_db is not None
    assert post_in_db.title == "How to kill a griffin?"


def test_create_post_unauthorized(client: TestClient):
    payload = {
        "title": "Secrets",
        "content": "Only for authorized users.",
        "category_id": 1
    }
    response = client.post("/posts/", json=payload)

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"
    
def test_get_nonexistent_post(authorized_client: TestClient):
    response = authorized_client.get("/posts/99999")

    assert response.status_code == 404
    assert response.json()["detail"] =="Post not found"

def test_delete_post_success(authorized_client: TestClient, db_session: Session, test_post: Post):
    assert db_session.query(Post).filter_by(id=test_post.id).first() is not None

    response = authorized_client.delete(f"/posts/{test_post.id}")
    assert response.status_code == 204
    post_in_db = db_session.query(Post).filter_by(id=test_post.id).first()
    assert post_in_db is None

def test_delete_post_forbidden(authorized_client: TestClient, db_session: Session):
    vesemir = User(
        username="vesemir",
        email="vesemir@kaermorhen.com",
        password_hash="hash",
        race_id=1
    )
    db_session.add(vesemir)
    db_session.flush()

    post = Post(
        title="How to sharpen swords",
        content="The basics of blacksmithing.",
        author_id=vesemir.id,
        category_id=1
    )
    db_session.add(post)
    db_session.commit()

    response = authorized_client.delete(f"/posts/{post.id}")

    assert response.status_code == 403
    assert response.json()["detail"] == "Only author of the post and admin can delete it"
    
    
def test_like_post_success(authorized_client: TestClient, db_session: Session, test_user: dict, test_post: Post):
    response = authorized_client.post(f"/posts/{test_post.id}/like")

    assert response.status_code == 200

    user = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user is not None
    like_in_db = db_session.query(PostLike).filter_by(post_id=test_post.id, user_id=user.id).first()
    assert like_in_db is not None

def test_like_nonexistent_post(authorized_client: TestClient):
    response = authorized_client.post("/posts/99999/like")

    assert response.status_code == 404
    assert response.json()["detail"] =="Post not found"

def test_unlike_post_success(authorized_client: TestClient, db_session: Session, test_user: dict, test_post: Post):
    user = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user is not None
    like = PostLike(post_id=test_post.id, user_id=user.id)
    db_session.add(like)
    db_session.commit()

    response = authorized_client.delete(f"/posts/{test_post.id}/like")

    assert response.status_code == 200
    like_in_db = db_session.query(PostLike).filter_by(post_id=test_post.id, user_id=user.id).first()
    assert like_in_db is None
    
def test_unlike_nonexistent_post(authorized_client: TestClient):
    response = authorized_client.delete("/posts/99999/like")

    assert response.status_code == 404
    assert response.json()["detail"] =="Post not found"
    
def test_post_visibility_restricted_by_race(authorized_client: TestClient, db_session: Session):
    triss = User(
        username="triss",
        email="triss@maribor.com",
        password_hash="hash",
        race_id=2
    )
    db_session.add(triss)
    db_session.flush()

    secret_post = Post(
        title="Secret Lodge of Sorceresses Meeting",
        content="No witchers allowed.",
        author_id=triss.id,
        category_id=1
    )
    db_session.add(secret_post)
    db_session.flush()

    restriction = PostVisibleRace(post_id=secret_post.id, race_id=2)
    db_session.add(restriction)
    db_session.commit()

    response = authorized_client.get(f"/posts/{secret_post.id}")

    assert response.status_code == 404
    assert response.json()["detail"] =="Post not found"