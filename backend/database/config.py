from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    host: str = "db"
    port: str = "5432"
    database: str = "sql_app"
    server : str = "localhost"
    user: str = "postgres"
    password : str = "YourStrong!Passw0rd"
    driver : str = "ODBC Driver 17 for SQL Server"
    JWT_SECRET : str = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
    model_config = SettingsConfigDict(env_file='../.env', env_file_encoding='utf-8')


settings = Settings()
