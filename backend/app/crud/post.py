from sqlalchemy import exists, and_, not_
from sqlalchemy.orm import Session
from app.models import Post, PostVisibleRace, PostTag

def create_post(db: Session, post: Post, visible_race_ids: list[int], tag_ids: list[int]) -> Post:
    db.add(post)
    db.flush()
    
    for race_id in visible_race_ids:
        db.add(PostVisibleRace(post_id=post.id, race_id=race_id))
        
    for tag_id in tag_ids:
        db.add(PostTag(post_id=post.id, tag_id=tag_id))
    
    db.commit()
    db.refresh(post)
    return post

def post_visibility_filter(race_id: int):
    visible_for_race = exists().where(and_(
        PostVisibleRace.post_id == Post.id,
        PostVisibleRace.race_id == race_id
    ))
    
    has_any_visibility_restriction = exists().where(
        PostVisibleRace.post_id == Post.id
    )
    
    return not_(has_any_visibility_restriction) | visible_for_race

def get_posts(skip: int, limit: int, db: Session, race_id: int) -> list[Post]:
    return (
        db.query(Post)
        .filter(post_visibility_filter(race_id))
        .order_by(Post.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_post_by_id(db: Session, post_id: int, race_id: int) -> Post|None:
    return (
        db.query(Post)
        .filter(Post.id == post_id)
        .filter(post_visibility_filter(race_id))
        .first()
    )
    