from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.user import User
from app.models.message import Conversation, Message

def test_open_conversation_success(authorized_client: TestClient, db_session: Session):
    yen = User(
        username="yennefer", email="yen@vengerberg.com", password_hash="hash", race_id=2
    )
    db_session.add(yen)
    db_session.commit()

    response = authorized_client.post(f"/conversations/{yen.id}/open")

    assert response.status_code == 200
    data = response.json()
    assert "id" in data
    assert data["other_participant"]["username"] == "yennefer"


def test_open_conversation_with_self(authorized_client: TestClient, db_session: Session, test_user: dict):
    geralt = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert geralt is not None

    response = authorized_client.post(f"/conversations/{geralt.id}/open")

    assert response.status_code == 400
    assert response.json()["detail"] == "You cannot send a message to yourself"


def test_unauthorized_conversation_access(authorized_client: TestClient, db_session: Session):
    yen = User(username="yennefer", email="yen@vengerberg.com", password_hash="hash", race_id=2)
    triss = User(username="triss", email="triss@maribor.com", password_hash="hash", race_id=2)
    db_session.add_all([yen, triss])
    db_session.flush()

    conv = Conversation(participant_one_id=yen.id, participant_two_id=triss.id)
    db_session.add(conv)
    db_session.commit()

    response = authorized_client.get(f"/conversations/{conv.id}/messages")

    assert response.status_code == 403
    assert response.json()["detail"] == "You are not a participant of this conversation"


def test_unread_count_and_mark_read(authorized_client: TestClient, db_session: Session, test_user: dict):
    geralt = db_session.query(User).filter_by(username=test_user["username"]).first()
    assert geralt is not None
    jaskier = User(username="dandelion", email="jaskier@novigrad.com", password_hash="hash", race_id=2)
    db_session.add(jaskier)
    db_session.flush()

    conv = Conversation(participant_one_id=geralt.id, participant_two_id=jaskier.id)
    db_session.add(conv)
    db_session.flush()

    msg = Message(
        conversation_id=conv.id, 
        content="I wrote a new song!", 
        sender_id=jaskier.id, 
        receiver_id=geralt.id
    )
    db_session.add(msg)
    
    conv.last_message_at = func.now() 
    db_session.commit()

    response_count = authorized_client.get("/conversations/unread-count")
    assert response_count.status_code == 200
    assert response_count.json()["unread_count"] == 1

    response_mark = authorized_client.patch(f"/conversations/{conv.id}/read")
    assert response_mark.status_code == 204

    response_count_after = authorized_client.get("/conversations/unread-count")
    assert response_count_after.json()["unread_count"] == 0

    db_session.refresh(msg)
    assert msg.is_read is True