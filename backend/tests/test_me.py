from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.user import UserFollow, User
from app.core.security import verify_password

def test_get_me_success(authorized_client: TestClient, test_user: dict):
    response = authorized_client.get("/me")

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["username"] == test_user["username"]
    
def test_get_feed_profile_success(authorized_client: TestClient, test_user: dict, db_session: Session):
    jaskier = User(
        username="jaskier",
        email="jaskier@novigrad.com",
        password_hash="fake_hash",
        race_id=1
    )
    db_session.add(jaskier)
    db_session.flush()

    geralt = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert geralt is not None

    follow = UserFollow(follower_id=jaskier.id, followed_id=geralt.id)
    db_session.add(follow)
    db_session.commit()

    response = authorized_client.get("me/feed-profile")

    assert response.status_code == 200
    data = response.json()
    
    assert data["username"] == test_user["username"]
    assert "race" in data  
    assert data["followers_count"] == 1 
    assert data["following_count"] == 0
    

def test_update_profile_success(authorized_client: TestClient, db_session: Session, test_user: dict):
    payload = {
        "bio": "New bio",
        "location": "Kaer Morhen",
        "avatar_url": "http://example.com/avatar.png"
    }
    response = authorized_client.patch("/me", json=payload)

    assert response.status_code == 200
    data = response.json()
    assert data["bio"] == "New bio"

    user_in_db = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user_in_db is not None
    assert user_in_db.location == "Kaer Morhen"
    
def test_update_profile_whitespace_validation(authorized_client: TestClient):
    payload = {
        "username": "   ",
        "bio": "   "
    }
    response = authorized_client.patch("/me", json=payload)

    assert response.status_code == 422
    assert "Username cannot be empty of whitespace only" in response.text


def test_change_password_success(authorized_client: TestClient, db_session: Session, test_user: dict):
    payload = {
        "old_password": test_user["password"],
        "new_password": "new_super_password"
    }
    response = authorized_client.post("/me/change-password", json=payload)

    assert response.status_code == 200

    user_in_db = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user_in_db is not None
    assert verify_password("new_super_password", user_in_db.password_hash)


def test_change_password_invalid_old_password(authorized_client: TestClient):
    payload = {
        "old_password": "wrong_old_password",
        "new_password": "new_super_password"
    }
    response = authorized_client.post("/me/change-password", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "Incorrect old password"
    
def test_change_password_too_short(authorized_client: TestClient, test_user: dict):
    payload = {
        "old_password": test_user["password"],
        "new_password": "short"
    }
    response = authorized_client.post("/me/change-password", json=payload)

    assert response.status_code == 422


def test_change_email_success(authorized_client: TestClient, db_session: Session, test_user: dict):
    payload = {
        "new_email": "new.email@kaermorhen.com"
    }
    response = authorized_client.post("/me/change-email", json=payload)

    assert response.status_code == 200

    user_in_db = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user_in_db is not None
    assert user_in_db.email == "new.email@kaermorhen.com"


def test_change_email_duplicate(authorized_client: TestClient, db_session: Session):
    yen = User(
        username="yennefer",
        email="yen@vengerberg.com",
        password_hash="hash",
        race_id=2
    )
    db_session.add(yen)
    db_session.commit()

    payload = {
        "new_email": "yen@vengerberg.com"
    }
    response = authorized_client.post("/me/change-email", json=payload)

    assert response.status_code == 400
    assert response.json()["detail"] == "Email already exists"