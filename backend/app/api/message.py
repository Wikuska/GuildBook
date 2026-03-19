from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import message as message_service
from app.schemas.message import SendMessageRequest, MessageResponse


router = APIRouter(prefix="/messages", tags=["messages"])


@router.post("/{receiver_id}", response_model=MessageResponse, status_code=201)
def send_message(
    receiver_id: int,
    data: SendMessageRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.send_message(db, receiver_id, data, current_user)


@router.get("/{user_id}", response_model=list[MessageResponse])
def get_conversation(
    user_id: int,
    limit: int = Query(20, ge=1, le=100),
    before_id: int | None = Query(None, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.get_conversation(db, user_id, limit, current_user, before_id)