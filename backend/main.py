from fastapi import FastAPI
from routers import router_users, router_auth, router_foods, router_stock_food, router_expenses
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from services.populate_service import init_db
from middleware.auth_middleware import AuthMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(
    lifespan=lifespan,
    root_path="/api",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    )
app.add_middleware(AuthMiddleware)
app.include_router(router_auth.router, prefix="/auth", tags=["auth"])
app.include_router(router_users.router, prefix="/users", tags=["users"])
app.include_router(router_foods.router, prefix="/foods", tags=["foods"])
app.include_router(router_stock_food.router, prefix="/stock_food", tags=["stock_food"])
app.include_router(router_expenses.router, prefix="/expenses", tags=["expenses"])
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
