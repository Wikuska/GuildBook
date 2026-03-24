from sqlalchemy.orm import Session, joinedload
from app.models.notification import Notification, NotificationType

def create_notification(
    db: Session,
    recipient_id: int,
    actor_id: int,
    notification_type: NotificationType,
    post_id: int | None = None,
) -> Notification | None:
    if recipient_id == actor_id:
        return None

    notification = Notification(
        recipient_id=recipient_id,
        actor_id=actor_id,
        type=notification_type,
        post_id=post_id,
    )
    db.add(notification)
    db.flush()
    return notification


def get_notifications(
    db: Session,
    recipient_id: int,
    before_id: int | None = None,
    limit: int = 20,
) -> list[Notification]:
    query = (
        db.query(Notification)
        .options(joinedload(Notification.actor))
        .filter(Notification.recipient_id == recipient_id)
    )
    if before_id is not None:
        query = query.filter(Notification.id < before_id)

    return (
        query
        .options(joinedload(Notification.actor))
        .order_by(Notification.id.desc())
        .limit(limit)
        .all()
    )


def count_unread(db: Session, recipient_id: int) -> int:
    return (
        db.query(Notification)
        .filter(
            Notification.recipient_id == recipient_id,
            Notification.is_read.is_(False),
        )
        .count()
    )


def mark_one_read(db: Session, notification_id: int, recipient_id: int) -> Notification | None:
    notification = (
        db.query(Notification)
        .options(joinedload(Notification.actor))
        .filter(
            Notification.id == notification_id,
            Notification.recipient_id == recipient_id,
        )
        .first()
    )
    if notification:
        notification.is_read = True
        db.flush()
    return notification


def mark_all_read(db: Session, recipient_id: int) -> None:
    (
        db.query(Notification)
        .filter(
            Notification.recipient_id == recipient_id,
            Notification.is_read.is_(False),
        )
        .update({"is_read": True}, synchronize_session=False)
    )
    db.flush()