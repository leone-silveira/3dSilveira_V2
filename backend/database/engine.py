from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import urllib.parse
from database.config import Settings

settings = Settings()
odbc_str = (
    f"DRIVER={settings.driver};"
    f"SERVER={settings.server},{settings.port};"
    f"DATABASE={settings.database};"
    f"UID={settings.user};"
    f"PWD={settings.password};"
    "Encrypt=yes;"
    "TrustServerCertificate=no;"
)
connect_str = f"mssql+aioodbc:///?odbc_connect={urllib.parse.quote_plus(odbc_str)}"
# new connect_str but without urllib    
connection_string = (
    f"mssql+aioodbc://{settings.user}:{settings.password}@{settings.server}:1433/{settings.database}"
    f"?driver={settings.driver.replace(' ', '+')}&TrustServerCertificate=yes"
)

connect_str2 = (
    f"mssql+aioodbc://{settings.user}:{settings.password}@{settings.server}:{settings.port}/{settings.database}"
    f"?driver={urllib.parse.quote_plus(settings.driver)}&Encrypt=yes&TrustServerCertificate=no"
)
print(connection_string, connect_str, connect_str2)
engine = create_async_engine(connection_string, echo=True, future=True)
AsyncSessionLocal  = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)


AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)
# engine = create_async_engine(connection_string, echo=True, future=True)
# AsyncSessionLocal  = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
