from models.stock_foods import StockFood
from schemas.stock_food import StockFoodCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select


async def get_stock_foods(db: AsyncSession):
    result = await db.execute(select(StockFood))
    return result.scalars().all()


async def get_stock_food_by_id(db: AsyncSession, food_id: int):
    result = await db.execute(select(StockFood).where(StockFood.id == food_id))
    return result.scalars().first()


async def get_stock_food_by_name(db: AsyncSession, name: str):
    result = await db.execute(select(StockFood).where(StockFood.name == name))
    return result.scalars().first()

async def create_stock_food(db: AsyncSession, food: StockFoodCreate):
    db_stock_food = StockFood(**food.model_dump())
    db.add(db_stock_food)
    await db.commit()
    await db.refresh(db_stock_food)
    return db_stock_food


async def update_stock_food(food_id: int, food_data: StockFoodCreate, db: AsyncSession):
    stock_food = await get_stock_food_by_id(db, food_id)
    if stock_food is None:
        return None
    for key, value in food_data.model_dump(exclude_unset=True).items(): #just ignore unset fields :)
        setattr(stock_food, key, value)
    await db.commit()
    await db.refresh(stock_food)
    return stock_food


async def delete_stock_food(food_id: int, db: AsyncSession):
    stock_food = await get_stock_food_by_id(db, food_id)
    if stock_food is None:
        return None
    await db.delete(stock_food)
    await db.commit()
    return stock_food

async def get_stock_food_by_type(db: AsyncSession, type: str):
    result = await db.execute(select(StockFood).where(StockFood.food_type == type))
    return result.scalars()
