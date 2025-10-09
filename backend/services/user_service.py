from fastapi import HTTPException
from models.users import User
from schemas.user import UserCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


async def get_users(db: AsyncSession):
    result = await db.execute(select(User))
    return result.scalars().all()


async def get_user_by_id(db: AsyncSession, user_id: int):
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalars().first()


async def get_user_by_username(db: AsyncSession, username: str):
    result = await db.execute(select(User).where(User.username == username))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: UserCreate):
    db_user = User(username=user.username, email=user.email,
                   password=user.password, activate=user.activate)
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user


async def update_user(user_id: int, user_data: UserCreate, db: AsyncSession):
    user = await get_user_by_id(db, user_id)
    if user is None:
        return None
    user.username = user_data.username
    user.email = user_data.email
    user.password = user_data.password
    await db.commit()
    await db.refresh(user)
    return user


async def update_user_status(user_id: int, status: bool, db: AsyncSession):
    user = await get_user_by_id(db, user_id)
    if user is None:
        return None
    user.activate = status
    await db.commit()
    await db.refresh(user)
    return user


async def delete_user(user_id: int, db: AsyncSession):
    user = await get_user_by_id(db, user_id)
    if user is None:
        return None
    await db.delete(user)
    await db.commit()
    return user


async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(User).where(User.email == email))
    return result.scalars().first()

async def authenticate_user(db: AsyncSession, username: str, password: str):
    user = await get_user_by_username(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not user or user.password != password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    return user