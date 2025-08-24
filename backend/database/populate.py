from backend.services.populate_service import populate_db
from backend.database.engine import engine
from backend.database.base import Base

Base.metadata.create_all(bind=engine)
populate_db()
