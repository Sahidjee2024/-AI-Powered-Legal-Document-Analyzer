# core/vectorstore.py
import chromadb
from chromadb.config import Settings as ChromaSettings
from core.embeddings import get_embedding
from config import settings

COLLECTION_NAME = "legal_documents"

def get_chroma_client():
    return chromadb.PersistentClient(
        path=settings.chroma_persist_dir,
        settings=ChromaSettings(anonymized_telemetry=False)
    )

def get_collection():
    client = get_chroma_client()
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"hnsw:space": "cosine"}
    )

async def add_chunks(chunks: list[dict]) -> int:
    """Embed and store chunks in ChromaDB."""
    collection = get_collection()
    ids, embeddings, documents, metadatas = [], [], [], []

    for chunk in chunks:
        embedding = await get_embedding(chunk["text"])
        ids.append(chunk["chunk_id"])
        embeddings.append(embedding)
        documents.append(chunk["text"])
        metadatas.append({
            "doc_id": chunk["doc_id"],
            "filename": chunk["filename"],
            "page_num": chunk["page_num"],
            "chunk_index": chunk["chunk_index"]
        })

    collection.add(ids=ids, embeddings=embeddings, documents=documents, metadatas=metadatas)
    return len(chunks)

async def query_chunks(query_text: str, doc_ids: list[str], top_k: int = 5) -> list[dict]:
    """Retrieve top-k relevant chunks for given doc_ids."""
    collection = get_collection()
    query_embedding = await get_embedding(query_text)

    where_filter = {"doc_id": {"$in": doc_ids}} if doc_ids else None

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where_filter,
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        chunks.append({
            "text": doc,
            "metadata": results["metadatas"][0][i],
            "distance": results["distances"][0][i]
        })
    return chunks

def delete_document_chunks(doc_id: str):
    """Remove all chunks belonging to a document."""
    collection = get_collection()
    collection.delete(where={"doc_id": doc_id})
