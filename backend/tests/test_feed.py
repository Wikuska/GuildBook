from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app.models.post import Post, PostTag, PostVisibleRace
from app.models.user import User

def test_feed_category_filtering(authorized_client: TestClient, db_session: Session, test_user: dict):
    user = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user is not None
    
    post_discussion = Post(title="Geralt's swords", content="Silver or steel?", author_id=user.id, category_id=1)
    post_market = Post(title="Selling Drowner brains", content="Cheap!", author_id=user.id, category_id=2)
    
    db_session.add_all([post_discussion, post_market])
    db_session.commit()

    response_feed = authorized_client.get("/feed") 
    
    assert response_feed.status_code == 200
    feed_data = response_feed.json()
    assert len(feed_data) == 1
    assert feed_data[0]["title"] == "Geralt's swords"

    response_market = authorized_client.get("/feed/market")
    
    assert response_market.status_code == 200
    market_data = response_market.json()
    assert len(market_data) == 1
    assert market_data[0]["title"] == "Selling Drowner brains"


def test_feed_tag_filtering(authorized_client: TestClient, db_session: Session, test_user: dict):
    user = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert user is not None
    
    post_with_tag = Post(title="Monster hunt", content="Looking for a griffin.", author_id=user.id, category_id=4)
    db_session.add(post_with_tag)
    db_session.flush()

    post_tag = PostTag(post_id=post_with_tag.id, tag_id=1)
    db_session.add(post_tag)
    db_session.commit()

    response = authorized_client.get("/feed/contracts?tag_ids=1")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["title"] == "Monster hunt"

def test_feed_market_race_restriction(authorized_client: TestClient, db_session: Session):
    yen = User(
        username="yennefer", 
        email="yen@vengerberg.com", 
        password_hash="hash", 
        race_id=2
    )
    db_session.add(yen)
    db_session.flush()

    secret_market_post = Post(
        title="Selling restricted magic items", 
        content="Humans only!", 
        author_id=yen.id, 
        category_id=2
    )
    db_session.add(secret_market_post)
    db_session.flush()

    restriction = PostVisibleRace(post_id=secret_market_post.id, race_id=2)
    db_session.add(restriction)
    db_session.commit()

    response = authorized_client.get("/feed/market")

    assert response.status_code == 200
    data = response.json()
    
    post_ids_in_feed = [post["id"] for post in data]
    assert secret_market_post.id not in post_ids_in_feed

def test_feed_invalid_tag_error(authorized_client: TestClient):
    response = authorized_client.get("/feed/?tag_ids=9999")

    assert response.status_code == 400
    assert response.json()["detail"] == "Tag filter contains invalid or non-existing ids"