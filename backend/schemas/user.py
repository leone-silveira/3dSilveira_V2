from pydantic import BaseModel


class UserBase(BaseModel):
    username: str
    email: str
    password: str
    activate: bool


class UserCreate(UserBase):
    pass


class UserOut(UserBase):
    id: int

    class Config:
        orm_mode = True


class UserLogin(BaseModel):
    email: str
    password: str