from models.stock_foods import StockFood
from schemas.stock_food import StockFoodCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


async def get_foods(db: AsyncSession):
    result = await db.execute(select(StockFood))
    return result.scalars().all()


async def get_food_by_id(db: AsyncSession, food_id: int):
    result = await db.execute(select(StockFood).where(StockFood.id == food_id))
    return result.scalars().first()


async def get_food_by_name(db: AsyncSession, name: str):
    result = await db.execute(select(StockFood).where(StockFood.name == name))
    return result.scalars().first()

async def create_food(db: AsyncSession, food: StockFoodCreate):
    db_food = StockFood(**food.model_dump())
    db.add(db_food)
    await db.commit()
    await db.refresh(db_food)
    return db_food


async def update_food(food_id: int, food_data: StockFoodCreate, db: AsyncSession):
    food = await get_food_by_id(db, food_id)
    if food is None:
        return None
    for key, value in food_data.model_dump(exclude_unset=True).items(): #just ignore unset fields :)
        setattr(food, key, value)
    await db.commit()
    await db.refresh(food)
    return food


async def delete_food(food_id: int, db: AsyncSession):
    food = await get_food_by_id(db, food_id)
    if food is None:
        return None
    await db.delete(food)
    await db.commit()
    return food


async def get_food_by_type(db: AsyncSession, type: str):
    result = await db.execute(select(StockFood).where(StockFood.food_type == type))
    return result.scalars().first()
