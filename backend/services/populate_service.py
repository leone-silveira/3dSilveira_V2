from sqlalchemy.future import select
from database.engine import AsyncSessionLocal, engine
from database.base import Base
from models.users import User
from models.foods import Food 
from models.database_config import Config


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        async with session.begin():
            users_to_create = [
                {"username": "admin", "password": "admin123", "email": "admin@example.com","role": "admin", "activate": True},
                {"username": "user_test", "password": "test123", "email": "test@example.com", "role": "user", "activate": True},
            ]
            foods_to_create = [
                {"name": "Banana", "food_type": "Fruit", "quantity": "80g", "calories": 71.2, "protein": 1.04, "carbohydrate": 17.6, "fat": 0.24, "fiber": 2.08},
                {"name": "Chicken Breast", "food_type": "Meat", "quantity": "100g", "calories": 165, "protein": 31, "carbohydrate": 0, "fat": 3.6, "fiber": 0},
            ]
            for u in users_to_create:
                result = await session.execute(select(User).where(User.username == u["username"]))
                if not result.scalars().first():
                    session.add(User(**u))

            for u in foods_to_create:
                result = await session.execute(select(Food).where(Food.name == u["name"]))
                if not result.scalars().first():
                    session.add(Food(**u))


            configs_to_create = [
                {"key": "system_mode", "value": "production"},
                {"key": "version", "value": "1.0"},
            ]
            for c in configs_to_create:
                result = await session.execute(select(Config).where(Config.key == c["key"]))
                if not result.scalars().first():
                    session.add(Config(**c))