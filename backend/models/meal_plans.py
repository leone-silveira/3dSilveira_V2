from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.base import Base


class MealPlanEntry(Base):
    __tablename__ = "meal_plan_entries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(String(10), nullable=False)   # YYYY-MM-DD
    meal_type = Column(String(20), nullable=False)  # breakfast | lunch | snack | dinner
    dish_id = Column(Integer, ForeignKey("dishes.id"), nullable=False)
    servings = Column(Float, default=1.0, nullable=False)
    dish = relationship("Dish")
