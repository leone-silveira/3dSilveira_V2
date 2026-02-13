from fastapi import APIRouter, Depends, HTTPException
from database.engine import AsyncSessionLocal
from services import food_service
from schemas.food import FoodCreate, FoodOut
from sqlalchemy.ext.asyncio import AsyncSession
from database.dependency import get_db

router = APIRouter(tags=["foods"])

@router.get("/", response_model=list[FoodOut])
async def read_foods(db: AsyncSession = Depends(get_db)):
    return await food_service.get_foods(db)


@router.get("/{food_id}", response_model=FoodOut)
async def read_food(
    food_id: int,
    db: AsyncSession = Depends(get_db)
):
    food = await food_service.get_food_by_id(db, food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food


@router.post("/", response_model=FoodOut)
async def create(
    food: FoodCreate,
    db: AsyncSession = Depends(get_db)
):
    return await food_service.create_food(db, food)


@router.put("/{food_id}", response_model=FoodOut)
async def update_food_id(
    food_id: int,
    food: FoodCreate,
    db: AsyncSession = Depends(get_db)
):
    update_food = await food_service.update_food(food_id, food, db)
    if update_food is None:
        raise HTTPException(status_code=404, detail='Food not found')
    return update_food


@router.delete("/{food_id}")
async def delete_food(
    food_id: int,
    db: AsyncSession = Depends(get_db)
):
    delete_food = await food_service.delete_food(food_id, db)
    if delete_food is None:
        raise HTTPException(status_code=404, detail='Food not found')
    return {"detail": "Food deleted successfully"}
