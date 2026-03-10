from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password
from app.core.exceptions import EmailAlreadyExistsError, UsernameAlreadyExistsError, InvalidCredentialsError
from app.crud import user as user_crud


def register_new_user(db: Session, data: RegisterRequest):
    
    if user_crud.get_user_by_email(db, data.email):
        raise EmailAlreadyExistsError()
    if user_crud.get_user_by_username(db, data.username):
        raise UsernameAlreadyExistsError()

    hashed_pwd = hash_password(data.password)

    new_user = user_crud.create_user(
        db=db,
        username=data.username,
        email=data.email,
        hashed_password=hashed_pwd,
        race_id=data.race_id
    )
    return new_user

def authenticate_user(db: Session, email: str, password: str):

    user = user_crud.get_user_by_email(db, email)
    if not user:
        raise InvalidCredentialsError()
    if not verify_password(password, user.password_hash):
        raise InvalidCredentialsError()
    return user
