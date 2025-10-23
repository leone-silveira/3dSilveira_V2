from datetime import datetime, timedelta, timezone
from typing import Annotated
from jose import jwt, JWTError
from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
from pydantic import BaseModel

from database.engine import AsyncSessionLocal
from services import user_service
from schemas.user import UserOut
from database.config import Settings
from utils.jwt import verify_jwt_token
settings = Settings()

router = APIRouter(tags=["auth"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
SECRET_KEY = settings.JWT_SECRET



async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


async def get_current_user(
    request: Request,
    token: Annotated[str, Depends(oauth2_scheme)] = None,
    db: AsyncSession = Depends(get_db)
):
    jwt_token = token
    if not jwt_token:
        jwt_token = request.cookies.get("access_token")

    if not jwt_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user_id = verify_jwt_token(jwt_token)
    user = await user_service.get_user_by_id(db, int(user_id))
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


@router.post("/login", response_model=UserOut)
async def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: AsyncSession = Depends(get_db)
):
    user = await user_service.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")

    response.delete_cookie("3dSilveira_token")
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user.id),
        "username": user.username,
        "roles": user.role,
        "iat": datetime.now(timezone.utc),
    }

    access_token = create_access_token(
        data=payload,
        expires_delta=access_token_expires
    )

    response.set_cookie(
        key="3dSilveira_token",
        value=access_token,
        httponly=True,
        secure=False,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

    return user


@router.get("/me", response_model=UserOut)
async def read_current_user(current_user: Annotated[UserOut, Depends(get_current_user)]):
    return current_user
