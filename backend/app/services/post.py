from sqlalchemy.orm import Session
from app.models import User, Post
from app.schemas.post import CreatePostRequest
from app.crud import post as post_crud
from app.crud import category as category_crud
from app.core.exceptions import CategoryNotFoundError, PostNotFoundError

def create_new_post(db: Session, data: CreatePostRequest, current_user: User) -> Post:
    category = category_crud.get_category_by_id(db, data.category_id)
    if not category:
        raise CategoryNotFoundError()

    post = Post(
        title=data.title,
        content=data.content,
        author_id=current_user.id,
        category_id=data.category_id,
    )

    return post_crud.create_post(db, post, data.visible_race_ids)

def get_posts(db: Session, skip: int, limit: int, current_user: User):
    return post_crud.get_posts(skip, limit, db, current_user.race_id)

def get_post(db: Session, post_id: int, current_user: User):
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id)
    if not post:
        raise PostNotFoundError()
    return post