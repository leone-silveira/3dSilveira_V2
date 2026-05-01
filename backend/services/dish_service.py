from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models.dishes import Dish, DishItem
from schemas.dish import DishCreate


async def _load_dish(db: AsyncSession, dish_id: int):
    result = await db.execute(
        select(Dish)
        .where(Dish.id == dish_id)
        .options(selectinload(Dish.items).selectinload(DishItem.food))
    )
    return result.scalars().first()


async def get_dishes(db: AsyncSession):
    result = await db.execute(
        select(Dish).options(selectinload(Dish.items).selectinload(DishItem.food))
    )
    return result.scalars().all()


async def get_dish_by_id(db: AsyncSession, dish_id: int):
    return await _load_dish(db, dish_id)


async def create_dish(db: AsyncSession, data: DishCreate):
    dish = Dish(name=data.name, description=data.description)
    db.add(dish)
    await db.flush()  # get dish.id before adding items
    for item in data.items:
        db.add(DishItem(dish_id=dish.id, food_id=item.food_id, quantity=item.quantity))
    await db.commit()
    return await _load_dish(db, dish.id)


async def update_dish(db: AsyncSession, dish_id: int, data: DishCreate):
    dish = await _load_dish(db, dish_id)
    if dish is None:
        return None
    dish.name = data.name
    dish.description = data.description
    # Replace all items
    for item in list(dish.items):
        await db.delete(item)
    await db.flush()
    for item in data.items:
        db.add(DishItem(dish_id=dish.id, food_id=item.food_id, quantity=item.quantity))
    await db.commit()
    return await _load_dish(db, dish.id)


async def delete_dish(db: AsyncSession, dish_id: int):
    dish = await _load_dish(db, dish_id)
    if dish is None:
        return None
    await db.delete(dish)
    await db.commit()
    return dish
