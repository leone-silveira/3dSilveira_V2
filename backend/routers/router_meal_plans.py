from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from database.dependency import get_db
from services import meal_plan_service
from schemas.meal_plan import MealPlanEntryCreate, MealPlanEntryOut

router = APIRouter(tags=["meal_plans"])


@router.get("/", response_model=list[MealPlanEntryOut])
async def list_entries(date: str, db: AsyncSession = Depends(get_db)):
    return await meal_plan_service.get_entries_by_date(db, date)


@router.post("/", response_model=MealPlanEntryOut)
async def add_entry(data: MealPlanEntryCreate, db: AsyncSession = Depends(get_db)):
    return await meal_plan_service.create_entry(db, data)


@router.delete("/{entry_id}")
async def remove_entry(entry_id: int, db: AsyncSession = Depends(get_db)):
    entry = await meal_plan_service.delete_entry(db, entry_id)
    if not entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"detail": "Entry removed"}
