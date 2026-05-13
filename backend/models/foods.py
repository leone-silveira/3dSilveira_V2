from sqlalchemy import Column, Integer, String, Float
from database.base import Base

class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    food_type = Column(String(50), nullable=False)
    quantity = Column(Float)
    calories = Column(Float)
    protein = Column(Float)
    carbohydrate = Column(Float)
    fat = Column(Float)
    fiber = Column(Float)
