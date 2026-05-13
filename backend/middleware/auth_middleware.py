from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from utils.jwt import verify_jwt_token

class AuthMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        public_paths = [
            "/docs",
            "/redoc",
            "/openapi.json",
            "/auth/login",
            "/auth/me",
            "/auth/logout",
            "/alexa",
        ]
        if request.method == "OPTIONS":
            return await call_next(request)
        # scope["path"] includes root_path when uvicorn is started with --root-path.
        # Strip it so we can match against plain route paths like "/auth/login".
        raw_path = request.scope.get("path", request.url.path)
        root_path = request.scope.get("root_path", "")
        route_path = raw_path[len(root_path):] if root_path and raw_path.startswith(root_path) else raw_path
        if not route_path:
            route_path = "/"
        if any(route_path.startswith(path) for path in public_paths):
            return await call_next(request)
        token = request.cookies.get("3dSilveira_token")
        if not token:
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

        try:
            user_data = verify_jwt_token(token)
            request.state.user = user_data
        except Exception as e:
            return JSONResponse(status_code=401, content={"detail": str(e)})

        response = await call_next(request)
        return response
