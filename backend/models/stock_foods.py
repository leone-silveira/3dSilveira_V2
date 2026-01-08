from sqlalchemy import Column, Integer, String, Float
from database.base import Base

class StockFood(Base):
    __tablename__ = "stock_foods"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    food_type = Column(String(50), nullable=False)
    quantity = Column(Float(50))
    unit = Column(String(10))
    expiry = Column(String(50))