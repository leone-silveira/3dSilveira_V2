from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.expenses import Expense
from schemas.expense import ExpenseCreate, ExpenseUpdate
from datetime import datetime


async def create_expense(db: AsyncSession, user_id: int, expense_data: ExpenseCreate):
    expense = Expense(
        user_id=user_id,
        **expense_data.model_dump()
    )
    db.add(expense)
    await db.commit()
    await db.refresh(expense)
    return expense


async def get_expenses_by_user(db: AsyncSession, user_id: int):
    result = await db.execute(
        select(Expense).where(Expense.user_id == user_id).order_by(Expense.date.desc())
    )
    return result.scalars().all()


async def get_expense_by_id(db: AsyncSession, expense_id: int):
    result = await db.execute(
        select(Expense).where(Expense.id == expense_id)
    )
    return result.scalar_one_or_none()


async def update_expense(db: AsyncSession, expense_id: int, expense_data: ExpenseUpdate):
    expense = await get_expense_by_id(db, expense_id)
    if not expense:
        return None
    
    update_data = expense_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(expense, field, value)
    
    expense.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(expense)
    return expense


async def delete_expense(db: AsyncSession, expense_id: int):
    expense = await get_expense_by_id(db, expense_id)
    if not expense:
        return False
    
    await db.delete(expense)
    await db.commit()
    return True


async def get_expenses_by_category(db: AsyncSession, user_id: int, category: str):
    result = await db.execute(
        select(Expense).where(
            (Expense.user_id == user_id) & (Expense.category == category)
        ).order_by(Expense.date.desc())
    )
    return result.scalars().all()
