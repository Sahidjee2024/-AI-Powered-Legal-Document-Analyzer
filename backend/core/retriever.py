# core/retriever.py
from core.vectorstore import query_chunks
from config import settings

async def retrieve_relevant_chunks(
    query: str,
    doc_ids: list[str],
    top_k: int | None = None
) -> list[dict]:
    """Retrieve relevant chunks for a query from specified documents."""
    k = top_k or settings.top_k_retrieval
    return await query_chunks(query, doc_ids, k)
