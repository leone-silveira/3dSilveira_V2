from backend.models.users import User
from backend.database.engine import SessionLocal


def populate_db():
    db = SessionLocal()
    try:
        users = [
            User(
                username="leone",
                password="123456",
                email="leone@example.com",
                activate=True
            ),
            User(
                username="maria",
                password="senha123",
                email="maria@example.com",
                activate=False
            ),
        ]

        db.add_all(users)
        db.commit()
        print("✔ Banco populado com sucesso!")
    except Exception as e:
        db.rollback()
        print("Erro ao popular:", e)
    finally:
        db.close()
