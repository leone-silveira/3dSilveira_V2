from pydantic import BaseModel


class StockFoodBase(BaseModel):    
    name: str
    food_type: str
    quantity: int
    unit: str
    expiry: str

class StockFoodCreate(StockFoodBase):
    pass

class StockFoodOut(StockFoodBase):
    id: int

    class Config:
        orm_mode = True 