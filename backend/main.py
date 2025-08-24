from fastapi import FastAPI
from routers import router_users, router_auth
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(router_auth.router, prefix="/auth", tags=["auth"])
app.include_router(router_users.router, prefix="/users", tags=["users"])
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173", 
        "http://localhost:5000",
        ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True )
