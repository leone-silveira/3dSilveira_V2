from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from database.dependency import get_db
from routers.router_auth import get_current_user
from schemas.user import UserOut
from schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut
from services import expense_service

router = APIRouter(tags=["expenses"])


@router.post("/", response_model=ExpenseOut)
async def create_expense(
    expense_data: ExpenseCreate,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    return await expense_service.create_expense(db, current_user.id, expense_data)


@router.get("/", response_model=list[ExpenseOut])
async def get_expenses(
    current_user: Annotated[UserOut, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    return await expense_service.get_expenses_by_user(db, current_user.id)


@router.get("/{expense_id}", response_model=ExpenseOut)
async def get_expense(
    expense_id: int,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    expense = await expense_service.get_expense_by_id(db, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    return expense


@router.put("/{expense_id}", response_model=ExpenseOut)
async def update_expense(
    expense_id: int,
    expense_data: ExpenseUpdate,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    expense = await expense_service.get_expense_by_id(db, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    
    return await expense_service.update_expense(db, expense_id, expense_data)


@router.delete("/{expense_id}")
async def delete_expense(
    expense_id: int,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    expense = await expense_service.get_expense_by_id(db, expense_id)
    if not expense or expense.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
    
    await expense_service.delete_expense(db, expense_id)
    return {"message": "Expense deleted successfully"}


@router.get("/category/{category}", response_model=list[ExpenseOut])
async def get_expenses_by_category(
    category: str,
    current_user: Annotated[UserOut, Depends(get_current_user)],
    db: AsyncSession = Depends(get_db)
):
    return await expense_service.get_expenses_by_category(db, current_user.id, category)
