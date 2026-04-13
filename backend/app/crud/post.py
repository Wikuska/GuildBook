from sqlalchemy import exists, and_, not_, or_, true
from sqlalchemy.orm import Session, joinedload, selectinload
from datetime import datetime, timedelta, timezone
from app.models import Post, PostVisibleRace, Tag
from app.crud import tag as tag_crud
from app.crud import race as race_crud
from app.models.user import User

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

    return updated_post if updated_post is not None else post

def get_user_posts(
    posts_creator_id: int,
    skip: int,
    limit: int,
    db: Session,
    race_id: int,
    user_id: int,
    is_admin: bool,
) -> list[Post]:
    query = (
        db.query(Post)
        .filter(_post_visibility_filter(race_id, user_id, is_admin))
        .filter(Post.author_id == posts_creator_id)
    )

    return (
        query
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    
def get_feed_posts(
    db: Session,
    followed_ids: list[int],
    race_id: int,
    user_id: int,
    is_admin: bool,
    skip: int,
    limit: int,
    category_ids: list[int] | None = None,
    tag_ids: list[int] | None = None,
) -> list[Post]:
    boost_cutoff = datetime.now(timezone.utc) - timedelta(days=3)
    visibility = _post_visibility_filter(race_id, user_id, is_admin)

    base_query = (
        db.query(Post)
        .options(
            joinedload(Post.author).joinedload(User.race),
            joinedload(Post.category),
            selectinload(Post.tags),
        )
        .filter(visibility)
    )

    if category_ids:
        base_query = base_query.filter(Post.category_id.in_(category_ids))

    if tag_ids:
        base_query = base_query.join(Post.tags).filter(Tag.id.in_(tag_ids)).distinct()

    if followed_ids:
        boosted = (
            base_query
            .filter(
                Post.author_id.in_(followed_ids),
                Post.created_at >= boost_cutoff,
            )
            .order_by(Post.created_at.desc())
            .all()
        )
        boosted_ids = {p.id for p in boosted}

        rest = (
            base_query
            .filter(~Post.id.in_(boosted_ids) if boosted_ids else true())
            .order_by(Post.created_at.desc())
            .all()
        )

        combined = boosted + rest
        return combined[skip: skip + limit]

    return (
        base_query
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
    
def delete_post(db: Session, post: Post) -> None:
    db.delete(post)
    db.commit()
