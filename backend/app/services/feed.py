from sqlalchemy.orm import Session
from app.crud import category as category_crud
from app.crud import post as post_crud
from app.models.post import Post
from app.models.user import User

FEED_CATEGORY_IDS = [1, 5, 7]


def get_feed(db: Session, skip: int, limit: int, current_user: User) -> list[Post]:

    return post_crud.get_posts(
        db=db,
        skip=skip,
        limit=limit,
        race_id=current_user.race_id,
        user_id=current_user.id,
        is_admin=current_user.is_admin,
        category_ids=FEED_CATEGORY_IDS,
        tag_ids=None,
    )