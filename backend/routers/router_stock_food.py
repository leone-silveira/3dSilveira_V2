from fastapi import APIRouter, Depends, HTTPException
from database.engine import AsyncSessionLocal
from services import stock_food_service
from schemas.stock_food import StockFoodOut, StockFoodCreate
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(tags=["stock_food"])


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session


@router.get("/", response_model=list[StockFoodOut])
async def read_stock_food(db: AsyncSession = Depends(get_db)):
    return await stock_food_service.get_foods(db)


@router.get("/{food_id}", response_model=StockFoodOut)
async def read_stock_food(
    food_id: int,
    db: AsyncSession = Depends(get_db)
):
    food = await stock_food_service.get_food_by_id(db, food_id)
    if not food:
        raise HTTPException(status_code=404, detail="Food not found")
    return food


@router.post("/", response_model=StockFoodOut)
async def create(
    food: StockFoodCreate,
    db: AsyncSession = Depends(get_db)
):
    return await stock_food_service.create_food(db, food)


@router.put("/{food_id}", response_model=StockFoodOut)
async def update_food_id(
    food_id: int,
    food: StockFoodCreate,
    db: AsyncSession = Depends(get_db)
):
    update_food = await stock_food_service.update_food(food_id, food, db)
    if update_food is None:
        raise HTTPException(status_code=404, detail='Food not found')
    return update_food


@router.delete("/{food_id}")
async def delete_food(
    food_id: int,
    db: AsyncSession = Depends(get_db)
):
    delete_food = await stock_food_service.delete_food(food_id, db)
    if delete_food is None:
        raise HTTPException(status_code=404, detail='Food not found')
    return {"detail": "Food deleted successfully"}
