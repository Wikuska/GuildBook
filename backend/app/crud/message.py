from sqlalchemy import or_, and_
from sqlalchemy.orm import Session
from app.models import Message, Conversation, User
from sqlalchemy.orm import joinedload


def create_message(db: Session, message: Message) -> Message:
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_conversation_messages(
    db: Session,
    conversation_id: int,
    limit: int,
    before_id: int | None = None,
) -> list[Message]:
    query = db.query(Message).filter(Message.conversation_id == conversation_id)

    if before_id:
        query = query.filter(Message.id < before_id)

    messages = query.order_by(Message.created_at.asc()).limit(limit).all()
    return list(reversed(messages))


def get_or_create_conversation(
    db: Session,
    user_one_id: int,
    user_two_id: int,
) -> Conversation:
    conversation = (
        db.query(Conversation)
        .filter(
            or_(
                and_(
                    Conversation.participant_one_id == user_one_id,
                    Conversation.participant_two_id == user_two_id,
                ),
                and_(
                    Conversation.participant_one_id == user_two_id,
                    Conversation.participant_two_id == user_one_id,
                ),
            )
        )
        .first()
    )

    if not conversation:
        conversation = Conversation(
            participant_one_id=user_one_id,
            participant_two_id=user_two_id,
        )
        db.add(conversation)
        db.commit()
        db.refresh(conversation)

    return conversation


def get_user_conversations(
    db: Session,
    user_id: int,
) -> list[Conversation]:
    return (
        db.query(Conversation)
        .filter(
            or_(
                Conversation.participant_one_id == user_id,
                Conversation.participant_two_id == user_id,
            )
        )
        .options(
            joinedload(Conversation.participant_one).joinedload(User.race),
            joinedload(Conversation.participant_two).joinedload(User.race),
            joinedload(Conversation.messages),
        )
        .order_by(Conversation.created_at.desc())
        .all()
    )


def get_unread_count(db: Session, user_id: int) -> int:
    return (
        db.query(Message)
        .filter(Message.receiver_id == user_id, Message.is_read == False)
        .count()
    )


def mark_conversation_read(
    db: Session,
    conversation_id: int,
    user_id: int,
) -> None:
    db.query(Message).filter(
        Message.conversation_id == conversation_id,
        Message.receiver_id == user_id,
        Message.is_read == False,
    ).update({"is_read": True})
    db.commit()