from sqlalchemy import Column, Integer, String, Boolean
from database.base import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(100), nullable=False)
    email = Column(String(100), nullable=False, unique=True)
    role = Column(String(50), nullable=False, default="user")
    activate = Column(Boolean, default=True)
