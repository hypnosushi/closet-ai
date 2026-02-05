from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # -----------------------------
    # Database
    # -----------------------------
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "closet_ai"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"

    @property
    def DATABASE_URL(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:"
            f"{self.POSTGRES_PASSWORD}@"
            f"{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/"
            f"{self.POSTGRES_DB}"
        )

    # -----------------------------
    # Redis / Celery
    # -----------------------------
    REDIS_URL: str = "redis://redis:6379/0"

    # -----------------------------
    # MinIO / S3
    # -----------------------------
    MINIO_ENDPOINT: str = "http://minio:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "closet-ai"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
