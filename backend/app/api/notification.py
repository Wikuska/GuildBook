from fastapi import APIRouter, Depends, Query, status, Response, Request
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services import auth
from app.models import User
from app.services import notification as notification_service
from app.schemas.notification import NotificationResponse, UnreadCountResponse
from app.core.security import decode_access_token
from app.core.config import settings
from fastapi.responses import StreamingResponse
import redis.asyncio as redis
import json

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("", response_model=list[NotificationResponse])
def get_notifications(
    before_id: int | None = Query(default=None),
    limit: int = Query(default=20, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return notification_service.get_notifications(db, current_user, before_id, limit)


@router.get("/unread-count", response_model=UnreadCountResponse)
def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return notification_service.get_unread_count(db, current_user)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_one_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    return notification_service.mark_one_read(db, notification_id, current_user)


@router.patch("/read", status_code=status.HTTP_204_NO_CONTENT)
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(auth.get_current_user),
):
    notification_service.mark_all_read(db, current_user)

 
@router.get("/stream")
async def notification_stream(
    request: Request,
    token: str = Query(...)
):
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")
        user_race_id = payload.get("race_id")
        if not user_id:
            return Response(status_code=401)
    except Exception:
        return Response(status_code=401)

    async def event_generator():
        redis_conn = None
        pubsub = None
        channel_personal = f"user_notifications_{user_id}"
        channel_race = f"race_notifications_{user_race_id}"
        
        try:
            redis_conn = redis.from_url(settings.REDIS_URL)
            pubsub = redis_conn.pubsub()
            await pubsub.subscribe(channel_personal, channel_race)

            while True:
                if await request.is_disconnected():
                    break

                message = await pubsub.get_message(
                    ignore_subscribe_messages=True, 
                    timeout=30.0
                )

                if message:
                    data = message["data"].decode("utf-8")
                    
                    try:
                        parsed = json.loads(data)
                        if (
                            parsed.get("type") == "new_post"
                            and parsed.get("data", {}).get("author_id") == int(user_id)
                        ):
                            continue
                    except (json.JSONDecodeError, ValueError):
                        pass
    
                    yield f"data: {data}\n\n"

        finally:
            if pubsub is not None:
                await pubsub.unsubscribe(channel_personal, channel_race)
            if redis_conn is not None:
                await redis_conn.aclose()

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )