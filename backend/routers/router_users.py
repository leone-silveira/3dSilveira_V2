from fastapi import APIRouter, Depends, HTTPException
from services import user_service
from schemas.user import UserCreate, UserOut
from sqlalchemy.ext.asyncio import AsyncSession
from database.dependency import get_db


router = APIRouter(tags=["users"])

@router.get("/", response_model=list[UserOut])
async def read_users(db: AsyncSession = Depends(get_db)):
    return await user_service.get_users(db)


@router.get("/{user_id}", response_model=UserOut)
async def read_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    user = await user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/", response_model=UserOut)
async def create(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    return await user_service.create_user(db, user)


@router.put("/{user_id}", response_model=UserOut)
async def update_user_id(
    user_id: int,
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    update_user_id = await user_service.update_user(user_id, user, db)
    if update_user_id is None:
        raise HTTPException(status_code=404, detail='User not found')
    return update_user_id


@router.delete("/{user_id}")
async def delete_user_id(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    delete_user_id = await user_service.delete_user(user_id, db)
    if delete_user_id is None:
        raise HTTPException(status_code=404, detail='User not found')
    return {"detail": "User deleted successfully"}


@router.put("/{user_id}/{status}")
async def update_user_status(
    user_id: int,
    status: bool,
    db: AsyncSession = Depends(get_db)
):
    update_user_status = await user_service.update_user_status(user_id, status, db)
    if update_user_status is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"detail": f"User is {status} "}
