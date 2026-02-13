from sqlalchemy.future import select
from database.engine import AsyncSessionLocal, engine
from database.base import Base
from models.users import User
from models.foods import Food
from models.stock_foods import StockFood
from models.database_config import Config


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        async with session.begin():
            users_to_create = [
                {"username": "admin", "password": "admin123", "email": "admin@example.com","role": "admin", "activate": True},
                {"username": "user_test", "password": "test123", "email": "test@example.com", "role": "user", "activate": True},
            ] # link with json database response
            foods_to_create = [
                {"name": "Banana", "food_type": "Fruit", "quantity": "80g", "calories": 71.2, "protein": 1.04, "carbohydrate": 17.6, "fat": 0.24, "fiber": 2.08},
                {"name": "Chicken Breast", "food_type": "Meat", "quantity": "100g", "calories": 165, "protein": 31, "carbohydrate": 0, "fat": 3.6, "fiber": 0},
            ]
            stock_foods_to_create = [
                {"name": "Rice", "food_type": "Grain", "quantity": 5.0, "unit": "kg", "expiry": "2026-12-31"},
                {"name": "Olive Oil", "food_type": "Oil", "quantity": 2.0, "unit": "L", "expiry": "2026-11-30"},
            ]
            for u in users_to_create:
                result = await session.execute(select(User).where(User.username == u["username"]))
                if not result.scalars().first():
                    session.add(User(**u))

            existing_foods_result = await session.execute(select(Food.name))
            existing_names = existing_foods_result.scalars().all()
            for u in foods_to_create:
                if u['name'] not in existing_names:
                    session.add(Food(**u))

            stock_foods_result = await session.execute(select(StockFood.name))
            existing_stock_names = stock_foods_result.scalars().all()
            for u in stock_foods_to_create:
                if u['name'] not in existing_stock_names:
                    session.add(StockFood(**u))
            configs_to_create = [
                {"key": "system_mode", "value": "production"},
                {"key": "version", "value": "1.0"},
            ]

            config_result = await session.execute(select(Config.key))
            existing_config_keys = config_result.scalars().all()
            for c in configs_to_create:
                if c['key'] not in existing_config_keys:
                    session.add(Config(**c))