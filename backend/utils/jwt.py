# utils/jwt_utils.py
from jose import jwt, JWTError
from fastapi import HTTPException, status
from config.database import Settings


settings = Settings()
ALGORITHM = "HS256"
SECRET_KEY = settings.JWT_SECRET

def verify_jwt_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
