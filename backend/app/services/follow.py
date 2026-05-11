from sqlalchemy.orm import Session
from fastapi import BackgroundTasks
from app.models import User, NotificationType
from app.schemas.user import FollowStatusResponse
from app.crud import user as user_crud
from app.crud import follow as follow_crud
from app.crud import notification as notification_crud
from app.services.sse_service import broadcast_to_user
from app.core.exceptions import UserNotFoundError, SelfFollowNotAllowedError


def _ensure_target_user_exists(db: Session, target_user_id: int) -> None:
    target_user = user_crud.get_user_by_id(db, target_user_id)
    if not target_user:
        raise UserNotFoundError()


def _ensure_not_self_follow(current_user_id: int, target_user_id: int) -> None:
    if current_user_id == target_user_id:
        raise SelfFollowNotAllowedError()
    
def follow_user(db: Session, target_user_id: int, current_user: User, background_tasks: BackgroundTasks) -> FollowStatusResponse:
    _ensure_not_self_follow(current_user.id, target_user_id)
    _ensure_target_user_exists(db, target_user_id)
    
    existing_follow = follow_crud.get_follow(
        db,
        follower_id=current_user.id,
        followed_id=target_user_id
    )
    
    if existing_follow is None:
        follow_crud.create_follow(
            db,
            follower_id=current_user.id,
            followed_id=target_user_id
        )

        existing_notification = notification_crud.get_existing_notification(
            db,
            recipient_id=target_user_id,
            actor_id=current_user.id,
            notification_type=NotificationType.follow,
            within_hours=1
        )

        if not existing_notification:
            notification_crud.create_notification(
                db,
                recipient_id=target_user_id,
                actor_id=current_user.id,
                notification_type=NotificationType.follow,
            )
            background_tasks.add_task(
                broadcast_to_user,
                user_id=target_user_id,
                event_type="notification",
                payload={
                    "action": "user_follow",
                    "actor_id": current_user.id,
                    "actor_name": current_user.username
                }
            )

    db.commit()
    
    return FollowStatusResponse(
        target_user_id = target_user_id,
        followers_count = follow_crud.count_followers(db, target_user_id),
        is_followed_by_current_user = True
    )
    
def unfollow_user(db: Session, target_user_id: int, current_user: User) -> FollowStatusResponse:
    _ensure_not_self_follow(current_user.id, target_user_id)
    _ensure_target_user_exists(db, target_user_id)
    
    existing_follow = follow_crud.get_follow(
        db,
        follower_id = current_user.id,
        followed_id = target_user_id
    )
    
    if existing_follow is not None:
        follow_crud.delete_follow(db, existing_follow)
        
    db.commit()
    
    return FollowStatusResponse(
        target_user_id = target_user_id,
        followers_count = follow_crud.count_followers(db, target_user_id),
        is_followed_by_current_user = False
    )