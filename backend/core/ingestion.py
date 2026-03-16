# core/ingestion.py
import uuid
import fitz  # PyMuPDF
from docx import Document as DocxDocument
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path
from config import settings

def parse_pdf(file_path: str) -> list[dict]:
    """Extract text page by page from a PDF."""
    doc = fitz.open(file_path)
    pages = []
    for page_num, page in enumerate(doc, start=1):
        text = page.get_text("text").strip()
        if text:
            pages.append({"text": text, "page_num": page_num})
    doc.close()
    return pages

def parse_docx(file_path: str) -> list[dict]:
    """Extract text from a DOCX file (no page tracking)."""
    doc = DocxDocument(file_path)
    full_text = "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    return [{"text": full_text, "page_num": 1}]

def parse_txt(file_path: str) -> list[dict]:
    """Extract text from a plain text file."""
    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
        content = f.read()
    return [{"text": content, "page_num": 1}]

def ingest_document(file_path: str, doc_id: str, filename: str) -> list[dict]:
    """
    Parse + chunk a document.
    Returns list of chunk dicts ready for ChromaDB storage.
    """
    suffix = Path(file_path).suffix.lower()
    if suffix == ".pdf":
        pages = parse_pdf(file_path)
    elif suffix == ".docx":
        pages = parse_docx(file_path)
    elif suffix == ".txt":
        pages = parse_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {suffix}")

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", " ", ""]
    )

    chunks = []
    chunk_index = 0
    for page in pages:
        splits = splitter.split_text(page["text"])
        for split in splits:
            chunks.append({
                "chunk_id": f"{doc_id}_chunk_{chunk_index}",
                "text": split,
                "doc_id": doc_id,
                "filename": filename,
                "page_num": page["page_num"],
                "chunk_index": chunk_index
            })
            chunk_index += 1

    return chunks
