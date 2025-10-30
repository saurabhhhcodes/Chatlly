# backend/core/settings.py
from typing import List
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
import os

class Settings(BaseSettings):
    # Models / Keys
    GEMINI_API_KEY: str = Field(default="")
    EMBED_MODEL: str = Field(default="models/embedding-001")
    ANSWER_MODEL: str = Field(default="gemini-pro")

    # Auth
    BEARER_TOKEN: str = Field(default="dev-token-please-change")
    SECRET_KEY: str = Field(default="a-very-secret-key")
    GOOGLE_CLIENT_ID: str = Field(default="")
    GOOGLE_CLIENT_SECRET: str = Field(default="")
    MICROSOFT_CLIENT_ID: str = Field(default="")
    MICROSOFT_CLIENT_SECRET: str = Field(default="")

    # Paths
    DATA_DIR: str = Field(default="./data")
    INDEX_DIR: str = Field(default="./index_store/chroma_db")

    # CORS
    CORS_ALLOW_ORIGINS: List[str] = ["*"]

    model_config = SettingsConfigDict(
        env_file=".env" if os.path.exists(".env") else None,
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

settings = Settings()
