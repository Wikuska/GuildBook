from sqlalchemy.orm import Session
from app.crud import category as category_crud
from app.crud import tag as tag_crud
from app.crud import follow as follow_crud
from app.crud import post as post_crud
from app.schemas.post import PostResponse
from app.models.user import User
from app.services.post import build_post_responses, _normalize_ids
from app.core.exceptions import InvalidCategoryFilterError, InvalidTagFilterError

FEED_CATEGORY_IDS = [25, 27, 29]  
MARKET_CATEGORY_IDS = [26]            
HELP_CATEGORY_IDS = [27]           
CONTRACT_CATEGORY_IDS = [30]         


def _build_feed(
    db: Session,
    current_user: User,
    skip: int,
    limit: int,
    category_ids: list[int],
    tag_ids: list[int] | None
) -> list[PostResponse]:
    
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
    
    followed_ids = follow_crud.get_followed_user_ids(db, current_user.id)

    posts = post_crud.get_feed_posts(
        db=db,
        followed_ids=followed_ids,
        race_id=current_user.race_id,
        user_id=current_user.id,
        is_admin=current_user.is_admin,
        skip=skip,
        limit=limit,
        category_ids=category_ids,
        tag_ids=tag_ids
    )

    return build_post_responses(db, posts, current_user)


def get_feed(db, skip, limit, current_user, tag_ids):
    return _build_feed(db, current_user, skip, limit, FEED_CATEGORY_IDS, tag_ids)

def get_market(db, skip, limit, current_user, tag_ids):
    return _build_feed(db, current_user, skip, limit, MARKET_CATEGORY_IDS, tag_ids)

def get_help_requests(db, skip, limit, current_user, tag_ids):
    return _build_feed(db, current_user, skip, limit, HELP_CATEGORY_IDS, tag_ids)

def get_contracts(db, skip, limit, current_user, tag_ids):
    return _build_feed(db, current_user, skip, limit, CONTRACT_CATEGORY_IDS, tag_ids)