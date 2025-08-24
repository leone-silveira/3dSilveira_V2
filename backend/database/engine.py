from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import urllib.parse

server = "localhost"
port = 1433
database = "master"
username = "sa"
password = "YourStrong!Passw0rd"
driver = "ODBC Driver 17 for SQL Server"

odbc_str = (
    f"DRIVER={driver};"
    f"SERVER={server},{port};"
    f"DATABASE={database};"
    f"UID={username};"
    f"PWD={password};"
    "Encrypt=no;"
)
connect_str = f"mssql+aioodbc:///?odbc_connect={urllib.parse.quote_plus(odbc_str)}"

engine = create_async_engine(connect_str, echo=True, future=True)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)
engine = create_async_engine(connect_str, echo=True, future=True)

AsyncSessionLocal  = sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
