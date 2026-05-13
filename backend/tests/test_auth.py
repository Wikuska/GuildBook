from app.models import User 
from sqlalchemy.orm import Session
from fastapi.testclient import TestClient
from app.core.security import verify_password
from app.models.user import UserFollow
from tests.conftest import authorized_client, test_user

def test_register_success(client: TestClient, db_session: Session):
    payload = {
        "username": "geralt",
        "email": "geralt@kaermorhen.com",
        "password": "witcher123",
        "race_id": 1
    }

    response = client.post("/auth/register", json=payload)

    assert response.status_code == 201
    data = response.json()
    assert data["username"] == "geralt"
    assert "email" in data
    assert "password" not in data

    user_in_db = db_session.query(User).filter(User.username == "geralt").first()
    assert user_in_db is not None
    assert user_in_db.email == "geralt@kaermorhen.com"
    assert user_in_db.race_id == 1

    assert user_in_db.password_hash != "witcher123"
    assert verify_password("witcher123", user_in_db.password_hash)
    
    
def test_register_duplicate_email(client: TestClient):
    payload_1 = {
        "username": "geralt",
        "email": "geralt@kaermorhen.com",
        "password": "witcher123",
        "race_id": 1
    }
    client.post("/auth/register", json=payload_1)

    payload_2 = {
        "username": "vesemir",             
        "email": "geralt@kaermorhen.com", 
        "password": "different_password",
        "race_id": 1
    }
    response = client.post("/auth/register", json=payload_2)

    assert response.status_code == 400
    
    data = response.json()
    assert data["detail"] == "Email already exists"


def test_register_duplicate_username(client: TestClient):
    payload_1 = {
        "username": "yennefer",
        "email": "yen@vengerberg.com",
        "password": "magic_password",
        "race_id": 2
    }
    client.post("/auth/register", json=payload_1)

    payload_2 = {
        "username": "yennefer",           
        "email": "triss@maribor.com",   
        "password": "different_password",
        "race_id": 2
    }
    response = client.post("/auth/register", json=payload_2)

    assert response.status_code == 400
    
    data = response.json()
    assert data["detail"] == "Username already exists"


def test_login_success(client: TestClient, test_user: dict):
    response = client.post("/auth/login", json={
        "email": test_user["email"],
        "password": test_user["password"]
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert len(data["access_token"]) > 10
    
    
def test_login_invalid_password(client: TestClient, test_user:dict):
    response = client.post("/auth/login", json={
        "email": test_user["email"],
        "password": "wrong_password"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"


def test_login_nonexistent_user(client: TestClient):
    response = client.post("/auth/login", json={
        "email": "nobody@nowhere.com",
        "password": "some_password"
    })

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid email or password"
    

def test_get_me_success(authorized_client: TestClient, test_user: dict):
    response = authorized_client.get("/auth/me")

    assert response.status_code == 200
    data = response.json()
    assert data["email"] == test_user["email"]
    assert data["username"] == test_user["username"]
    assert data["is_admin"] is False
   
    
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

    response = authorized_client.get("/auth/me/feed-profile")

    assert response.status_code == 200
    data = response.json()
    
    assert data["username"] == test_user["username"]
    assert "race" in data  
    assert data["followers_count"] == 1 
    assert data["following_count"] == 0