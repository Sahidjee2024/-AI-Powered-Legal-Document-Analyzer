from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    ollama_base_url: str = "http://localhost:11434"
    ollama_llm_model: str = "qwen2.5:0.5b"
    ollama_embedding_model: str = "qwen3-embedding:0.6b"
    chroma_persist_dir: str = "./chroma_db"
    sqlite_db_path: str = "./legal_analyzer.db"
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 50
    chunk_size: int = 512
    chunk_overlap: int = 64
    top_k_retrieval: int = 5
    cors_origins: str = "http://localhost:3000"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
