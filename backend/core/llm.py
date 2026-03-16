# core/llm.py
import httpx
import json
from pydantic import BaseModel
from config import settings

async def call_llm(prompt: str, system: str = "") -> str:
    """Call Ollama LLM and return raw text response."""
    payload = {
        "model": settings.ollama_llm_model,
        "prompt": prompt,
        "stream": False,
    }
    if system:
        payload["system"] = system

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(
                f"{settings.ollama_base_url}/api/generate",
                json=payload
            )
            response.raise_for_status()
            return response.json()["response"]
        except httpx.ConnectError:
            raise ConnectionError("Cannot connect to Ollama. Ensure it is running.")
        except Exception as e:
            raise RuntimeError(f"LLM error: {str(e)}")

async def call_llm_structured(prompt: str, system: str, output_model: type[BaseModel]) -> BaseModel:
    """Call LLM and parse JSON response into Pydantic model. Retries once on failure."""
    for attempt in range(2):
        raw = await call_llm(prompt, system)
        try:
            # Strip markdown code fences if present
            clean = raw.strip()
            if clean.startswith("```"):
                clean = clean.split("```")[1]
                if clean.startswith("json"):
                    clean = clean[4:]
            clean = clean.strip()
            parsed = json.loads(clean)
            return output_model.model_validate(parsed)
        except Exception as e:
            if attempt == 1:
                raise ValueError(f"LLM did not return valid JSON after 2 attempts. Raw: {raw[:300]}")
            continue
