from sqlalchemy.orm import Session
from app.models import User, Notification
from app.crud import notification as notification_crud
from app.schemas.notification import NotificationResponse, UnreadCountResponse
from app.core.exceptions import NotificationNotFoundError

def get_notifications(
    db: Session,
    current_user: User,
    before_id: int | None = None,
    limit: int = 20,
) -> list[NotificationResponse]:
    notifications = notification_crud.get_notifications(
        db,
        recipient_id=current_user.id,
        before_id=before_id,
        limit=limit,
    )
    return [NotificationResponse.model_validate(n) for n in notifications]


def get_unread_count(db: Session, current_user: User) -> UnreadCountResponse:
    return UnreadCountResponse(
        unread_count=notification_crud.count_unread(db, current_user.id)
    )


def mark_one_read(db: Session, notification_id: int, current_user: User) -> NotificationResponse:
    notification = notification_crud.mark_one_read(db, notification_id, current_user.id)
    if not notification:
        raise NotificationNotFoundError()
    db.commit()
    return NotificationResponse.model_validate(notification)


def mark_all_read(db: Session, current_user: User) -> None:
    notification_crud.mark_all_read(db, current_user.id)
    db.commit()