from pydantic import BaseModel
from typing import Optional


class FoodBase(BaseModel):
    name: str
    food_type: str
    quantity: Optional[float] = None
    calories: Optional[float] = None
    protein: Optional[float] = None
    carbohydrate: Optional[float] = None
    fat: Optional[float] = None
    fiber: Optional[float] = None

class FoodCreate(FoodBase):
    pass


class FoodOut(FoodBase):
    id: int

    class Config:
        orm_mode = True