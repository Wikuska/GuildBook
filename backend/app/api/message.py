from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import message as message_service
from app.schemas.message import SendMessageRequest, MessageResponse, ConversationResponse, UnreadCountResponse


router = APIRouter(prefix="/conversations", tags=["conversations"])


@router.get("/conversations", response_model=list[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.get_user_conversations(db, current_user)


@router.get("/conversations/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    count = message_service.get_unread_count(db, current_user)
    return UnreadCountResponse(unread_count=count)


@router.post("/conversations/{other_user_id}/open", response_model=ConversationResponse)
def open_conversation(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.open_conversation(db, other_user_id, current_user)


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    limit: int = Query(20, ge=1, le=100),
    before_id: int | None = Query(None, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.get_conversation_messages(db, conversation_id, limit, current_user, before_id)


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse, status_code=201)
def send_message(
    conversation_id: int,
    data: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.send_message_to_conversation(db, conversation_id, data, current_user)


@router.patch("/conversations/{conversation_id}/read", status_code=204)
def mark_conversation_read(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    message_service.mark_conversation_read(db, conversation_id, current_user)