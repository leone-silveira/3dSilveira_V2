from sqlalchemy.future import select
from database.engine import AsyncSessionLocal, engine
from database.base import Base
from models.users import User
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
            for u in users_to_create:
                result = await session.execute(select(User).where(User.username == u["username"]))
                if not result.scalars().first():
                    session.add(User(**u))

            configs_to_create = [
                {"key": "system_mode", "value": "production"},
                {"key": "version", "value": "1.0"},
            ]
            for c in configs_to_create:
                result = await session.execute(select(Config).where(Config.key == c["key"]))
                if not result.scalars().first():
                    session.add(Config(**c))