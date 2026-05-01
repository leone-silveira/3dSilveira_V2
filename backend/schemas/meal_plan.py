from pydantic import BaseModel
from schemas.dish import DishOut


class MealPlanEntryCreate(BaseModel):
    date: str        # YYYY-MM-DD
    meal_type: str   # breakfast | lunch | snack | dinner
    dish_id: int
    servings: float = 1.0


class MealPlanEntryOut(BaseModel):
    id: int
    date: str
    meal_type: str
    dish_id: int
    servings: float
    dish: DishOut

    class Config:
        from_attributes = True
