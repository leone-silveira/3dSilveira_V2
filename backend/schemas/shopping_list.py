from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ShoppingListItemBase(BaseModel):
    item_name: str
    quantity: float
    unit: str
    estimated_price: Optional[float] = None


class ShoppingListItemCreate(ShoppingListItemBase):
    pass


class ShoppingListItemUpdate(BaseModel):
    item_name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    estimated_price: Optional[float] = None
    is_completed: Optional[bool] = None


class ShoppingListItemOut(ShoppingListItemBase):
    id: int
    shopping_list_id: int
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ShoppingListBase(BaseModel):
    name: str


class ShoppingListCreate(ShoppingListBase):
    pass


class ShoppingListUpdate(BaseModel):
    name: Optional[str] = None
    is_completed: Optional[bool] = None


class ShoppingListOut(ShoppingListBase):
    id: int
    user_id: int
    items: list[ShoppingListItemOut] = []
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
