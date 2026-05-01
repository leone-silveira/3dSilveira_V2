from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from models.meal_plans import MealPlanEntry
from models.dishes import Dish, DishItem
from schemas.meal_plan import MealPlanEntryCreate


def _entry_opts():
    return (
        select(MealPlanEntry)
        .options(
            selectinload(MealPlanEntry.dish)
            .selectinload(Dish.items)
            .selectinload(DishItem.food)
        )
    )


async def get_entries_by_date(db: AsyncSession, date: str):
    result = await db.execute(_entry_opts().where(MealPlanEntry.date == date))
    return result.scalars().all()


async def create_entry(db: AsyncSession, data: MealPlanEntryCreate):
    entry = MealPlanEntry(**data.model_dump())
    db.add(entry)
    await db.commit()
    result = await db.execute(
        _entry_opts().where(MealPlanEntry.id == entry.id)
    )
    return result.scalars().first()


async def delete_entry(db: AsyncSession, entry_id: int):
    result = await db.execute(select(MealPlanEntry).where(MealPlanEntry.id == entry_id))
    entry = result.scalars().first()
    if entry is None:
        return None
    await db.delete(entry)
    await db.commit()
    return entry
