from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.dependency import get_db
from services import dish_service
from schemas.dish import DishCreate, DishOut

router = APIRouter(tags=["dishes"])


@router.get("/", response_model=list[DishOut])
async def list_dishes(db: AsyncSession = Depends(get_db)):
    return await dish_service.get_dishes(db)


@router.get("/{dish_id}", response_model=DishOut)
async def get_dish(dish_id: int, db: AsyncSession = Depends(get_db)):
    dish = await dish_service.get_dish_by_id(db, dish_id)
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish


@router.post("/", response_model=DishOut)
async def create_dish(data: DishCreate, db: AsyncSession = Depends(get_db)):
    return await dish_service.create_dish(db, data)


@router.put("/{dish_id}", response_model=DishOut)
async def update_dish(dish_id: int, data: DishCreate, db: AsyncSession = Depends(get_db)):
    dish = await dish_service.update_dish(db, dish_id, data)
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return dish


@router.delete("/{dish_id}")
async def delete_dish(dish_id: int, db: AsyncSession = Depends(get_db)):
    dish = await dish_service.delete_dish(db, dish_id)
    if not dish:
        raise HTTPException(status_code=404, detail="Dish not found")
    return {"detail": "Dish deleted"}
