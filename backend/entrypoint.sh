#!/bin/sh
set -e

# Write the .env file that pydantic-settings reads from ../.env (relative to /app = /.env)
# Using dedicated env var names to avoid conflicts with system vars like $USER
cat > /.env << EOF
host=db
port=5432
database=sql_app
user=postgres
password=${POSTGRES_PASSWORD}
JWT_SECRET=${JWT_SECRET}
production_env=true
EOF

echo "[entrypoint] Waiting for PostgreSQL..."
until pg_isready -h db -p 5432 -U postgres; do
  sleep 2
done
echo "[entrypoint] PostgreSQL ready."

# Tables are created automatically by init_db() (Base.metadata.create_all)
# in the FastAPI lifespan event — no need to run alembic on a fresh install.
# Alembic migrations are only for incremental schema changes on an existing DB.

echo "[entrypoint] Starting uvicorn..."
exec uvicorn main:app --host 0.0.0.0 --port 8001 --root-path /api
