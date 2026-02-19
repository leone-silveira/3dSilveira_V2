from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    host: str = "db"
    port: str = "5432"
    database: str = "sql_app"
    server : str = "localhost"
    user: str = "postgres"
    password : str = "YourStrong!Passw0rd"
    JWT_SECRET : str = "YourJWTSecretKey"
    production_env: bool = False
    model_config = SettingsConfigDict(env_file='../.env', env_file_encoding='utf-8')


settings = Settings()
