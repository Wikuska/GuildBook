from sqlalchemy.orm import Session
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password, decode_access_token
from app.models import User
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from app.core.exceptions import EmailAlreadyExistsError, UsernameAlreadyExistsError, InvalidCredentialsError
from app.crud import user as user_crud
from app.db.database import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

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


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    try:
        payload = decode_access_token(token)
        user_id = payload.get("sub")

        if user_id is None:
            raise InvalidCredentialsError()

        user = user_crud.get_user_by_id(db, int(user_id))
    except (JWTError, ValueError):
        raise InvalidCredentialsError()

    if user is None:
        raise InvalidCredentialsError()

    return user
