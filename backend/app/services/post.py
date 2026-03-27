from sqlalchemy.orm import Session
from app.models import User, Post
from app.schemas.post import CreatePostRequest, PostResponse, TagResponse, CategoryResponse
from app.crud import post as post_crud
from app.crud import category as category_crud
from app.crud import tag as tag_crud
from app.crud import post_like as post_like_crud
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

def _build_post_response(
    post: Post,
    likes_count: int,
    is_liked_by_current_user: bool,
) -> PostResponse:
    return PostResponse(
        id=post.id,
        title=post.title,
        content=post.content,
        author_id=post.author_id,
        category=CategoryResponse.model_validate(post.category),
        created_at=post.created_at,
        tags=[TagResponse.model_validate(tag) for tag in post.tags],
        likes_count=likes_count,
        is_liked_by_current_user=is_liked_by_current_user,
    )
    
# RESPONSE BUILDERS

def build_post_response(db: Session, post: Post, current_user: User) -> PostResponse:
    likes_count = post_like_crud.count_post_likes(db, post.id)
    is_liked = post_like_crud.is_post_liked_by_user(db, post.id, current_user.id)

    return _build_post_response(post, likes_count, is_liked)

def build_post_responses(db: Session, posts: list[Post], current_user: User) -> list[PostResponse]:
    if not posts:
        return []

    post_ids = [post.id for post in posts]
    likes_count_map = post_like_crud.get_post_likes_count_map(db, post_ids)
    liked_post_ids = post_like_crud.get_liked_post_ids_for_user(db, post_ids, current_user.id)

    return [
        _build_post_response(
            post,
            likes_count_map.get(post.id, 0),
            post.id in liked_post_ids,
        )
        for post in posts
    ]

# POST FUNCTIONS

def create_new_post(db: Session, data: CreatePostRequest, current_user: User) -> PostResponse:
    
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

    created_post = post_crud.create_post(db, post, visible_race_ids, tag_ids)
    return build_post_response(db, created_post, current_user)

def update_post(
    db: Session,
    post_id: int,
    data: CreatePostRequest,
    current_user: User
) -> PostResponse:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    
    if post.author_id != current_user.id:
        raise PostEditForbiddenError()

    _validate_category_exists(db, data.category_id)
    tag_ids = _normalize_ids(data.tag_ids)
    visible_race_ids = _normalize_ids(data.visible_race_ids)
    _validate_tags_exist(db, tag_ids)

    updated_post = post_crud.update_post(
    db,
    post,
    title=data.title,
    content=data.content,
    category_id=data.category_id,
    visible_race_ids=visible_race_ids,
    tag_ids=tag_ids,
    )

    return build_post_response(db, updated_post, current_user)
    

def get_user_posts(
    db: Session,
    posts_creator_id: int,
    skip: int,
    limit: int,
    current_user: User
) -> list[PostResponse]:    
    
    posts = post_crud.get_user_posts(
    posts_creator_id=posts_creator_id,
    skip=skip,
    limit=limit,
    db=db,
    race_id=current_user.race_id,
    user_id=current_user.id,
    is_admin=current_user.is_admin
)

    return [build_post_response(db, post, current_user) for post in posts]

def get_post(db: Session, post_id: int, current_user: User) -> PostResponse:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    return build_post_response(db, post, current_user)

def delete_post(db: Session, post_id: int, current_user: User) -> None:
    post = post_crud.get_post_by_id(db, post_id, current_user.race_id, current_user.id, current_user.is_admin)
    if not post:
        raise PostNotFoundError()
    
    if post.author_id != current_user.id and not current_user.is_admin:
        raise PostDeleteForbiddenError()

    post_crud.delete_post(db, post)