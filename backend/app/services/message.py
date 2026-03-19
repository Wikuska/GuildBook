from sqlalchemy.orm import Session
from app.models import User, Message
from app.schemas.message import SendMessageRequest
from app.crud import message as message_crud
from app.crud import user as user_crud
from app.core.exceptions import UserNotFoundError, CannotMessageYourselfError


def send_message(
    db: Session,
    receiver_id: int,
    data: SendMessageRequest,
    current_user: User,
) -> Message:
    if receiver_id == current_user.id:
        raise CannotMessageYourselfError()

    receiver = user_crud.get_user_by_id(db, receiver_id)
    if not receiver:
        raise UserNotFoundError()

    message = Message(
        content=data.content,
        sender_id=current_user.id,
        receiver_id=receiver_id,
    )
    return message_crud.create_message(db, message)


def get_conversation(
    db: Session,
    other_user_id: int,
    limit: int,
    current_user: User,
    before_id: int | None = None,
) -> list[Message]:
    if other_user_id == current_user.id:
        raise CannotMessageYourselfError()

    receiver = user_crud.get_user_by_id(db, other_user_id)
    if not receiver:
        raise UserNotFoundError()
    
    return message_crud.get_conversation(db, current_user.id, other_user_id, limit, before_id)