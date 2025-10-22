from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from utils.jwt import verify_jwt_token

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/auth") or request.url.path.startswith("/docs"):
            return await call_next(request)
        
        token = request.cookies.get("access_token")

        if not token:
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

        try:
            user_data = verify_jwt_token(token)
            request.state.user = user_data
        except Exception as e:
            return JSONResponse(status_code=401, content={"detail": str(e)})

        response = await call_next(request)
        return response
