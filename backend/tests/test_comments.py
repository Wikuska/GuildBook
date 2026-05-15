from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.comment import Comment
from app.models.user import User
from app.models.post import Post

def test_create_comment_success(authorized_client: TestClient, db_session: Session, test_post: Post):
    payload = {"content": "Toss a coin to your witcher!"}
    
    response = authorized_client.post(f"/posts/{test_post.id}/comments", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["content"] == "Toss a coin to your witcher!"
    
    comment_in_db = db_session.query(Comment).filter_by(id=data["id"]).first()
    assert comment_in_db is not None
    assert comment_in_db.post_id == test_post.id


def test_create_comment_nonexistent_post(authorized_client: TestClient):
    payload = {"content": "This post doesn't exist"}
    response = authorized_client.post("/posts/99999/comments", json=payload)

    assert response.status_code == 404
    assert response.json()["detail"] == "Post not found"


def test_get_post_comments(authorized_client: TestClient, test_post: Post, test_comment: Comment):
    response = authorized_client.get(f"/posts/{test_post.id}/comments")

    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1
    assert data[0]["content"] == test_comment.content


def test_update_comment_success(authorized_client: TestClient, db_session: Session, test_comment: Comment):
    payload = {"content": "Updated comment content"}
    response = authorized_client.put(f"/comments/{test_comment.id}", json=payload)

    assert response.status_code == 200
    assert response.json()["content"] == "Updated comment content"

    db_session.refresh(test_comment)
    assert test_comment.content == "Updated comment content"


def test_update_comment_forbidden(authorized_client: TestClient, db_session: Session, test_post: Post):
    jaskier = User(username="jaskier", email="jaskier@novigrad.com", password_hash="hash", race_id=2)
    db_session.add(jaskier)
    db_session.flush()

    jaskier_comment = Comment(content="What a beautiful day!", post_id=test_post.id, author_id=jaskier.id)
    db_session.add(jaskier_comment)
    db_session.commit()

    payload = {"content": "I hate portals."}
    response = authorized_client.put(f"/comments/{jaskier_comment.id}", json=payload)

    assert response.status_code == 403
    assert response.json()["detail"] == "Only comment author can make changes"



def test_delete_comment_forbidden(authorized_client: TestClient, db_session: Session, test_post: Post):
    yen = User(username="yennefer", email="yen@vengerberg.com", password_hash="hash", race_id=2)
    db_session.add(yen)
    db_session.flush()

    yen_comment = Comment(content="Magic is chaos.", post_id=test_post.id, author_id=yen.id)
    db_session.add(yen_comment)
    db_session.commit()

    response = authorized_client.delete(f"/comments/{yen_comment.id}")

    assert response.status_code == 403
    assert response.json()["detail"] == "Only comment author and admin can delete"


def test_delete_comment_success(authorized_client: TestClient, db_session: Session, test_comment: Comment):
    response = authorized_client.delete(f"/comments/{test_comment.id}")

    assert response.status_code == 204
    
    deleted_comment = db_session.query(Comment).filter_by(id=test_comment.id).first()
    assert deleted_comment is None