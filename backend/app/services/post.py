from sqlalchemy.orm import Session
from app.models import User, Post
from app.schemas.post import CreatePostRequest
from app.crud import post as post_crud
from app.crud import category as category_crud
from app.crud import tag as tag_crud
from app.core.exceptions import CategoryNotFoundError, PostNotFoundError, TagNotFoundError, InvalidCategoryFilterError, InvalidTagFilterError, PostDeleteForbiddenError, PostEditForbiddenError

# HELPER FUNCTIONS

def _validate_category_exists(db: Session, category_id: int) -> None:
    if category_crud.count_categories_by_ids(db, [category_id]) == 0:
        raise CategoryNotFoundError()

def _normalize_ids(ids: list[int]|None) -> list[int]:
    if not ids:
        return []
    return list(dict.fromkeys(ids))

def _validate_tags_exist(db: Session, tag_ids: list[int]) -> None:
    if not tag_ids:
        return

    if tag_crud.count_tags_by_ids(db, tag_ids) != len(tag_ids):
        raise TagNotFoundError()
    
# POST FUNCTIONS

def create_new_post(db: Session, data: CreatePostRequest, current_user: User) -> Post:
    
    _validate_category_exists(db, data.category_id)
    tag_ids = _normalize_ids(data.tag_ids)
    visible_race_ids = _normalize_ids(data.visible_race_ids)
    _validate_tags_exist(db, tag_ids)
    
    post = Post(
        title=data.title,
        content=data.content,
        author_id=current_user.id,
        category_id=data.category_id,
    )

    return post_crud.create_post(db, post, visible_race_ids, tag_ids)

def update_post(
    db: Session,
    post_id: int,
    data: CreatePostRequest,
    current_user: User
) -> Post:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    
    if post.author_id != current_user.id:
        raise PostEditForbiddenError()

    _validate_category_exists(db, data.category_id)
    tag_ids = _normalize_ids(data.tag_ids)
    visible_race_ids = _normalize_ids(data.visible_race_ids)
    _validate_tags_exist(db, tag_ids)

    return post_crud.update_post(
        db,
        post,
        title=data.title,
        content=data.content,
        category_id=data.category_id,
        visible_race_ids=visible_race_ids,
        tag_ids=tag_ids,
    )
    

def get_posts(
    db: Session,
    skip: int,
    limit: int,
    current_user: User,
    category_ids: list[int] | None = None,
    tag_ids: list[int] | None = None
) -> list[Post]:    
    
    normalized_category_ids = _normalize_ids(category_ids) if category_ids else None
    normalized_tag_ids = _normalize_ids(tag_ids) if tag_ids else None
    
    if normalized_category_ids:
        if any(category_id <= 0 for category_id in normalized_category_ids):
            raise InvalidCategoryFilterError()

        categories = category_crud.get_categories_by_ids(db, normalized_category_ids)
        if len(categories) != len(normalized_category_ids):
            raise InvalidCategoryFilterError()

    if normalized_tag_ids:
        if any(tag_id <= 0 for tag_id in normalized_tag_ids):
            raise InvalidTagFilterError()

        tags = tag_crud.get_tags_by_ids(db, normalized_tag_ids)
        if len(tags) != len(normalized_tag_ids):
            raise InvalidTagFilterError()
    
    return post_crud.get_posts(
        skip=skip,
        limit=limit,
        db=db,
        race_id=current_user.race_id,
        user_id=current_user.id,
        is_admin=current_user.is_admin,
        category_ids=normalized_category_ids,
        tag_ids=normalized_tag_ids,
    )

def get_post(db: Session, post_id: int, current_user: User) -> Post:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    return post

def delete_post(db: Session, post_id: int, current_user: User) -> None:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    
    if post.author_id != current_user.id and not current_user.is_admin:
        raise PostDeleteForbiddenError()

    post_crud.delete_post(db, post)