from fastapi.testclient import TestClient
from sqlalchemy import StaticPool, create_engine
from sqlalchemy.orm import Session, sessionmaker
import pytest

from app.main import app
from app.db.database import get_db
from app.models import Base, User, UserFollow, Race, Category, Tag, Post, PostTag, PostVisibleRace, PostLike, Comment, Message, Conversation, Notification, NotificationType

TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    TEST_DATABASE_URL, 
    connect_args={"check_same_thread": False},
    poolclass=StaticPool
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        race_1 = Race(id=1, name="Witcher") 
        race_2 = Race(id=2, name="Human")
        
        cat_feed = Category(id=1, name="discussion")
        cat_market = Category(id=2, name="market")
        cat_help = Category(id=3, name="help_request")
        cat_contract = Category(id=4, name="contract")
        
        tag_1 = Tag(id=1, name="monsters")
        
        db.add_all([race_1, race_2, cat_feed, cat_market, cat_help, cat_contract, tag_1])
        db.commit()
    finally:
        db.close()
        
    yield
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(setup_db):
    """Test client with its own independent DB session."""
    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()

@pytest.fixture
def db_session(setup_db):
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        
@pytest.fixture
def test_user(client):
    user_data = {
        "username": "geralt",
        "email": "geralt@kaermorhen.com",
        "password": "witcher123",
        "race_id": 1
    }
    response = client.post("/auth/register", json=user_data)
    assert response.status_code == 201 
    return user_data

@pytest.fixture
def authorized_client(client, test_user):
    login_response = client.post("/auth/login", json={
        "email": test_user["email"],
        "password": test_user["password"]
    })
    
    token = login_response.json()["access_token"]
    client.headers = {
        **client.headers,
        "Authorization": f"Bearer {token}"
    }
    
    return client
    
@pytest.fixture
def test_post(db_session: Session, test_user: dict):
    user = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user is not None

    post = Post(
        title="How to defeat a Leshen?",
        content="Use Igni and Dimeritium bombs. Stay away from the ravens.",
        author_id=user.id,
        category_id=1
    )
    db_session.add(post)
    db_session.commit()
    db_session.refresh(post)
    
    return post

@pytest.fixture
def test_comment(db_session: Session, test_post: Post, test_user: dict):
    user = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user is not None
    
    comment = Comment(
        content="Witchers don't work for free.",
        post_id=test_post.id,
        author_id=user.id
    )
    db_session.add(comment)
    db_session.commit()
    db_session.refresh(comment)
    
    return comment