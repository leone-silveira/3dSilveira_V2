from typing import Optional
from pydantic import BaseModel


class StockFoodBase(BaseModel):
    name: str
    food_type: str
    quantity: float
    unit: str
    min_quantity: Optional[float] = None
    expiry: Optional[str] = None


class StockFoodCreate(StockFoodBase):
    pass


class StockFoodOut(StockFoodBase):
    id: int

    class Config:
        from_attributes = True
