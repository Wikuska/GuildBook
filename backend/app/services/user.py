from sqlalchemy.orm import Session
from app.models import User
from app.schemas.user import UpdateProfileRequest, PublicUserResponse, PrivateUserResponse, UserSearchResult
from app.crud import user as user_crud
from app.crud import follow as follow_crud
from app.crud import post as post_crud
from app.core.exceptions import UsernameAlreadyExistsError, UserNotFoundError

def _get_base_user_data(db: Session, user: User) -> dict:
    return {
        "id": user.id,
        "username": user.username,
        "race": user.race,
        "bio": user.bio,
        "avatar_url": user.avatar_url,
        "banner_url": user.banner_url,
        "location": user.location,
        "followers_count": follow_crud.count_followers(db, user.id),
        "following_count": follow_crud.count_following(db, user.id),
        "posts_count": post_crud.count_user_posts(db, user.id),
        "created_at": user.created_at
    }

def build_public_user_response(db: Session, user: User, current_user: User) -> PublicUserResponse:
    base_data = _get_base_user_data(db, user)
    
    base_data["is_followed_by_current_user"] = follow_crud.is_following(db, current_user.id, user.id)
    return PublicUserResponse(**base_data)
    
def build_private_user_response(db: Session, user: User) -> PrivateUserResponse:
    base_data = _get_base_user_data(db, user)

    base_data["email"] = user.email
    base_data["is_admin"] = user.is_admin
    base_data["is_followed_by_current_user"] = False
    return PrivateUserResponse(**base_data)

def get_user(db: Session, user_id: int, current_user: User) -> PublicUserResponse:
    user = user_crud.get_user_by_id(db, user_id)
    if not user:
        raise UserNotFoundError()
    return build_public_user_response(db, user, current_user)

def update_profile(db: Session, data: UpdateProfileRequest, current_user: User) -> PublicUserResponse:
    updates = data.model_dump(exclude_unset=True)

    if "username" in updates:
        existing = user_crud.get_user_by_username(db, updates["username"])
        if existing and existing.id != current_user.id:
            raise UsernameAlreadyExistsError()

    updated_user = user_crud.update_user(db, current_user, **updates)
    return build_private_user_response(db, updated_user)

def search_users(db: Session, query: str, current_user: User) -> list[UserSearchResult]:
    db_results = user_crud.search_users(db, query, current_user.id)
    results = []
    for user, is_followed in db_results: 
        results.append(UserSearchResult(
            id=user.id,
            username=user.username,
            race=user.race,
            is_followed=is_followed 
        ))
    return results