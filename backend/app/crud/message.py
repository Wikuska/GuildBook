from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from app.models import Message


def create_message(db: Session, message: Message) -> Message:
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_conversation(
    db: Session,
    user_id: int,
    other_user_id: int,
    limit: int,
    before_id: int | None = None,
) -> list[Message]:
    query = (
        db.query(Message)
        .filter(
            or_(
                and_(Message.sender_id == user_id, Message.receiver_id == other_user_id),
                and_(Message.sender_id == other_user_id, Message.receiver_id == user_id),
            )
        )
    )

    if before_id:
        query = query.filter(Message.id < before_id)

    messages = (
        query
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )
    
    return list(reversed(messages))