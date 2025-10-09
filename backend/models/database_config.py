from tokenize import String
from sqlalchemy import Column, Integer, String
from database.base import Base

class Config(Base):
    __tablename__ = "configs"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(50), unique=True, nullable=False)
    value = Column(String(100), nullable=False)
    
