from sqlalchemy.orm import Session
from app.models import User, Message, Conversation
from app.schemas.message import ConversationResponse, AuthorResponse, MessagePreviewResponse
from app.schemas.message import SendMessageRequest
from app.crud import message as message_crud
from app.crud import user as user_crud
from app.core.exceptions import UserNotFoundError, CannotMessageYourselfError, ConversationNotFoundError, UnauthorizedConversationError


def send_message_to_conversation(
    db: Session,
    conversation_id: int,
    data: SendMessageRequest,
    current_user: User,
) -> Message:
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise ConversationNotFoundError()
    if current_user.id not in (conversation.participant_one_id, conversation.participant_two_id):
        raise UnauthorizedConversationError()

    receiver_id = (
        conversation.participant_two_id
        if conversation.participant_one_id == current_user.id
        else conversation.participant_one_id
    )

    message = Message(
        conversation_id=conversation.id,
        content=data.content,
        sender_id=current_user.id,
        receiver_id=receiver_id,
    )
    return message_crud.create_message(db, message)


def get_conversation_messages(
    db: Session,
    conversation_id: int,
    limit: int,
    current_user: User,
    before_id: int | None = None,
) -> list[Message]:
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        raise ConversationNotFoundError()
    if current_user.id not in (conversation.participant_one_id, conversation.participant_two_id):
        raise UnauthorizedConversationError()

    return message_crud.get_conversation_messages(db, conversation_id, limit, before_id)


def open_conversation(
    db: Session,
    other_user_id: int,
    current_user: User,
) -> ConversationResponse:
    if other_user_id == current_user.id:
        raise CannotMessageYourselfError()

    other_user = user_crud.get_user_by_id(db, other_user_id)
    if not other_user:
        raise UserNotFoundError()

    conversation = message_crud.get_or_create_conversation(db, current_user.id, other_user_id)
    return build_conversation_response(conversation, current_user.id)


def get_user_conversations(
    db: Session,
    current_user: User,
) -> list[ConversationResponse]:
    conversations = message_crud.get_user_conversations(db, current_user.id)
    return [build_conversation_response(c, current_user.id) for c in conversations]


def get_unread_count(db: Session, current_user: User) -> int:
    return message_crud.get_unread_count(db, current_user.id)


def mark_conversation_read(
    db: Session,
    conversation_id: int,
    current_user: User,
) -> None:
    message_crud.mark_conversation_read(db, conversation_id, current_user.id)


def build_conversation_response(
    conversation: Conversation,
    current_user_id: int,
) -> ConversationResponse:
    other = (
        conversation.participant_two
        if conversation.participant_one_id == current_user_id
        else conversation.participant_one
    )
    last_message = conversation.messages[0] if conversation.messages else None
    unread_count = sum(
        1 for m in conversation.messages
        if m.receiver_id == current_user_id and not m.is_read
    )

    return ConversationResponse(
        id=conversation.id,
        other_participant=AuthorResponse.model_validate(other),
        last_message=MessagePreviewResponse.model_validate(last_message) if last_message else None,
        last_message_at=conversation.last_message_at,
        unread_count=unread_count,
        created_at=conversation.created_at,
    )