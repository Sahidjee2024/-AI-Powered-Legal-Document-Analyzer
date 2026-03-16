# core/embeddings.py
import httpx
from config import settings

async def get_embedding(text: str) -> list[float]:
    """Get embedding vector from local Ollama."""
    async with httpx.AsyncClient(timeout=30.0) as client:
        try:
            response = await client.post(
                f"{settings.ollama_base_url}/api/embeddings",
                json={"model": settings.ollama_embedding_model, "prompt": text}
            )
            response.raise_for_status()
            return response.json()["embedding"]
        except httpx.ConnectError:
            raise ConnectionError("Cannot connect to Ollama. Make sure it is running on localhost:11434")
        except Exception as e:
            raise RuntimeError(f"Embedding error: {str(e)}")
