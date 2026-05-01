from sqlalchemy import Column, Integer, String, Float
from database.base import Base

class StockFood(Base):
    __tablename__ = "stock_foods"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    food_type = Column(String(50), nullable=False)
    quantity = Column(Float, nullable=False, default=0)
    unit = Column(String(10), nullable=False)
    min_quantity = Column(Float, nullable=True)
    expiry = Column(String(50), nullable=True)