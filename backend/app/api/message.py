from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
import asyncio
from app.services.sse_service import broadcast_to_user
from sqlalchemy.orm import Session
from app.db.database import get_db, SessionLocal
from app.services import auth
from app.models import User
from app.services import message as message_service
from app.crud import message as message_crud
from app.core.security import decode_access_token
from app.core.connection_manager import manager
from app.crud import user as user_crud
from app.schemas.message import SendMessageRequest, MessageResponse, ConversationResponse, UnreadCountResponse


router = APIRouter(prefix="/conversations", tags=["conversations"])

@router.websocket("/{conversation_id}/ws")
async def conversation_ws(
    conversation_id: int,
    websocket: WebSocket
):
    await websocket.accept()
    
    try:
        auth_message = await asyncio.wait_for(websocket.receive_json(), timeout=3.0)
        token = auth_message.get("token")
        if not token:
            await websocket.close(code=4001, reason="No token received")
            return
            
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        if user_id is None:
            await websocket.close(code=4001, reason="Unauthorized token")
            return
            
    except asyncio.TimeoutError:
        await websocket.close(code=4008, reason="Authorization timeout")
        return
    except Exception:
        await websocket.close(code=4001, reason="Authorization error")
        return
    
    with SessionLocal() as db:
        current_user = user_crud.get_user_by_id(db, int(user_id))
        if current_user is None:
            await websocket.close(code=4001)
            return

    conversation = message_crud.get_conversation_by_id(db, conversation_id)
    if conversation is None or current_user.id not in (
        conversation.participant_one_id,
        conversation.participant_two_id,
    ):
        await websocket.close(code=4003)
        return

    await manager.connect(conversation_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            content = (data.get("content") or "").strip()
            if not content:
                continue

            with SessionLocal() as db:
                msg = message_service.send_message_to_conversation(
                    db,
                    conversation_id,
                    SendMessageRequest(content=content),
                    current_user,
                )
                
                broadcast_data = {
                    "id": msg.id,
                    "conversation_id": conversation_id,
                    "content": msg.content,
                    "sender_id": msg.sender_id,
                    "receiver_id": msg.receiver_id,
                    "is_read": msg.is_read,
                    "created_at": msg.created_at.isoformat(),
                }
                
                if msg.receiver_id != current_user.id:
                    asyncio.create_task(
                broadcast_to_user(
                    user_id=msg.receiver_id,
                    event_type="new_message",
                    payload={
                        "conversation_id": conversation_id,
                        "sender_name": current_user.username,
                        "snippet": msg.content[:30] + ("..." if len(msg.content) > 30 else "")
                    }
                )
            )
            
            await manager.broadcast(conversation_id, broadcast_data)
            
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, websocket)

@router.patch("/{conversation_id}/read", status_code=204)
async def mark_conversation_read(
    conversation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    message_service.mark_conversation_read(db, conversation_id, current_user)
    await manager.broadcast(conversation_id, {
        "type": "read_receipt",
        "conversation_id": conversation_id,
        "read_by": current_user.id,
    })

@router.get("", response_model=list[ConversationResponse])
def get_conversations(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.get_user_conversations(db, current_user)


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    count = message_service.get_unread_count(db, current_user)
    return UnreadCountResponse(unread_count=count)


@router.post("/{other_user_id}/open", response_model=ConversationResponse)
def open_conversation(
    other_user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.open_conversation(db, other_user_id, current_user)


@router.get("/{conversation_id}/messages", response_model=list[MessageResponse])
def get_conversation_messages(
    conversation_id: int,
    limit: int = Query(20, ge=1, le=100),
    before_id: int | None = Query(None, ge=1),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return message_service.get_conversation_messages(db, conversation_id, limit, current_user, before_id)