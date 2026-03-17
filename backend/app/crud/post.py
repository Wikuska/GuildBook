from sqlalchemy import exists, and_, not_, or_, true
from sqlalchemy.orm import Session, joinedload, selectinload
from app.models import Post, PostVisibleRace, PostTag, Tag
from app.core.exceptions import PostNotFoundError
from app.crud import tag as tag_crud
from app.crud import race as race_crud

# HELPER FUNCTIONS

def _post_visibility_filter(race_id, user_id, is_admin):
    if is_admin:
        return true()
    
    visible_for_race = exists().where(
        and_(
            PostVisibleRace.post_id == Post.id,
            PostVisibleRace.race_id == race_id,
        )
    )
    
    has_any_visibility_restriction = exists().where(
        PostVisibleRace.post_id == Post.id
    )
    
    return or_(
        Post.author_id == user_id,
        not_(has_any_visibility_restriction),
        visible_for_race
    )

# POST FUNCTIONS

def create_post(db: Session, post: Post, visible_race_ids: list[int], tag_ids: list[int]) -> Post:
    if tag_ids:
        post.tags = tag_crud.get_tags_by_ids(db, tag_ids)

    if visible_race_ids:
        post.visible_races = race_crud.get_races_by_ids(db, visible_race_ids)

    db.add(post)
    db.commit()
    db.refresh(post)
    return post

def update_post(
    db: Session,
    post: Post,
    title: str,
    content: str,
    category_id: int,
    visible_race_ids: list[int],
    tag_ids: list[int],
) -> Post:
    post.title = title
    post.content = content
    post.category_id = category_id

    post.tags = tag_crud.get_tags_by_ids(db, tag_ids)
    post.visible_races = race_crud.get_races_by_ids(db, visible_race_ids)

    db.commit()
    
    updated_post = (
        db.query(Post)
        .options(
            joinedload(Post.category),
            selectinload(Post.tags),
        )
        .filter(Post.id == post.id)
        .first()
    )

    if updated_post is None:
        raise PostNotFoundError()

    return updated_post

def get_posts(
    skip: int,
    limit: int,
    db: Session,
    race_id: int,
    user_id: int,
    is_admin: bool,
    category_ids: list[int] | None = None,
    tag_ids: list[int] | None = None,
) -> list[Post]:
    query = (
        db.query(Post)
        .options(
            joinedload(Post.category),
            selectinload(Post.tags),
        )
        .filter(_post_visibility_filter(race_id, user_id, is_admin))
    )

    if category_ids:
        query = query.filter(Post.category_id.in_(category_ids))

    if tag_ids:
        query = query.join(Post.tags).filter(Tag.id.in_(tag_ids)).distinct()

    return (
        query
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_post_by_id(
    db: Session,
    post_id: int,
    race_id: int,
    user_id: int,
    is_admin: bool
) -> Post|None:
    
    return (
        db.query(Post)
        .options(
            joinedload(Post.category),
            selectinload(Post.tags),
        )
        .filter(Post.id == post_id)
        .filter(_post_visibility_filter(race_id, user_id, is_admin))
        .first()
    )
    