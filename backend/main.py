from fastapi import FastAPI
from routers import router_users, router_auth, router_foods
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from services.populate_service import init_db
from database.engine import engine
from database.base import Base
from models.users import User
from models.database_config import Config

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(router_auth.router, prefix="/auth", tags=["auth"])
app.include_router(router_users.router, prefix="/users", tags=["users"])
app.include_router(router_foods.router, prefix="/foods", tags=["foods"])
print("Database tables created.")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5000",
        "http://localhost:5173",
        "http://127.0.0.1:5173", 
        "http://127.0.0.1:5000",

        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True )
