from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from config.database import Settings

settings = Settings()
server = "host.docker.internal" # put that because I want to connect in my raspberry pi 3

connection_string = (
    f"postgresql+asyncpg://{settings.user}:{settings.password}@{settings.host}:{settings.port}/{settings.database}"
)

engine = create_async_engine(
    connection_string,
    echo=True,
    future=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)
