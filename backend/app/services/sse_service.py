import json
import redis.asyncio as redis
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)

async def broadcast_to_user(user_id: int, event_type: str, payload: dict):
    redis_conn = None
    
    try:
        redis_conn = redis.from_url(settings.REDIS_URL)
        message = {
            "type": event_type,
            "data": payload
        }
        channel_name = f"user_notifications_{user_id}"
        await redis_conn.publish(channel_name, json.dumps(message))
        
    except Exception as e:
        logger.error(f"Nie udało się wysłać powiadomienia SSE do usera {user_id}: {e}")
        
    finally:
        if redis_conn is not None:
            await redis_conn.aclose()