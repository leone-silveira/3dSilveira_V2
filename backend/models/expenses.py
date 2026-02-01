from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from database.base import Base
from datetime import datetime
import enum


class ExpenseCategory(str, enum.Enum):
    GROCERIES = "groceries"
    UTILITIES = "utilities"
    TRANSPORTATION = "transportation"
    ENTERTAINMENT = "entertainment"
    HEALTHCARE = "healthcare"
    EDUCATION = "education"
    HOUSEHOLD = "household"
    DINING = "dining"
    SHOPPING = "shopping"
    OTHER = "other"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    description = Column(String(255), nullable=False)
    amount = Column(Float, nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False)
    date = Column(DateTime, default=datetime.utcnow, nullable=False)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)
    is_recurring = Column(Boolean, default=False)
    notes = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", backref="expenses")
    credit_card = relationship("CreditCard", backref="expenses")
