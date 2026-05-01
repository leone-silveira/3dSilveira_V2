from pydantic import BaseModel
from typing import Optional
from schemas.food import FoodOut


class DishItemCreate(BaseModel):
    food_id: int
    quantity: float


class DishItemOut(BaseModel):
    id: int
    food_id: int
    quantity: float
    food: FoodOut

    class Config:
        from_attributes = True


class DishCreate(BaseModel):
    name: str
    description: Optional[str] = None
    items: list[DishItemCreate] = []


class DishOut(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    items: list[DishItemOut] = []

    class Config:
        from_attributes = True
