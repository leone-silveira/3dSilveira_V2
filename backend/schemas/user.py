from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str
    activate: bool


class UserCreate(UserBase):
    password: str
    role: str = "user"


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: str
    password: str