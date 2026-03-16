# AI-Powered Legal Document Analyzer

A RAG-based (Retrieval-Augmented Generation) legal document analysis system that allows lawyers and paralegals to upload contracts, NDAs, and legal briefs, then ask natural language questions. The system extracts clauses, flags risks, summarizes obligations, and enables side-by-side document comparison.

![Tech Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![Ollama](https://img.shields.io/badge/Ollama-qwen2.5:0.5b-orange?logo=ollama)

---

## Features

- 📄 **Document Upload** — Upload PDF, DOCX, or TXT legal documents
- 🔍 **Clause Extraction** — Extract clauses with type, importance, and page reference
- ⚠️ **Risk Flagging** — Flag risks with exact citation and recommendations
- ❓ **Natural Language Q&A** — Ask questions about documents (RAG-powered)
- 📊 **Document Comparison** — Compare two documents side-by-side
- 📑 **PDF Export** — Export full analysis as professional PDF report
- 💾 **Session History** — Persistent session memory across page refreshes

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Next.js 14 (App Router) + Tailwind CSS   |
| Backend     | FastAPI (Python 3.11+)                   |
| LLM         | Local Ollama — `qwen2.5:0.5b`            |
| Embeddings  | Local Ollama — `qwen3-embedding:0.6b`    |
| Vector DB   | ChromaDB (local persistent)              |
| PDF Export  | WeasyPrint                               |
| Session DB  | SQLite (via SQLModel)                    |
| Validation  | Pydantic v2                              |

---

## Prerequisites

- **Python 3.11+** (or use [uv](https://github.com/astral-sh/uv))
- **Node.js 20+**
- **[Ollama](https://ollama.ai)** installed and running

---

## Quick Start

### 1. Pull Ollama Models

```bash
ollama pull qwen2.5:0.5b
ollama pull qwen3-embedding:0.6b
ollama serve
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Using pip
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Or using uv (recommended)
uv sync
uv run uvicorn main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 4. Open the Application

Visit **[http://localhost:3000](http://localhost:3000)**

---

## Docker Deployment

```bash
docker-compose up --build
```

> **Note:** Ollama must be running on your host machine for Docker to access it.

---

## API Documentation

Once the backend is running, access the interactive API docs:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Key Endpoints

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| POST   | `/api/documents/upload`         | Upload document(s)                 |
| GET    | `/api/documents`                | List all documents in session      |
| DELETE | `/api/documents/{id}`           | Delete document                    |
| POST   | `/api/analysis/clauses/{id}`    | Extract clauses from document      |
| POST   | `/api/analysis/risks/{id}`      | Flag risks in document             |
| POST   | `/api/analysis/summary/{id}`    | Generate obligation summary        |
| POST   | `/api/query`                    | Ask a natural language question    |
| POST   | `/api/compare`                  | Compare two documents              |
| GET    | `/api/export/{id}`              | Export analysis as PDF             |
| GET    | `/api/sessions/{session_id}`    | Get session history                |

---

## Project Structure

```
legal-doc-analyzer/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # Environment configuration
│   ├── requirements.txt         # Python dependencies
│   ├── api/
│   │   ├── routes/              # API route handlers
│   │   └── deps.py              # Shared dependencies
│   ├── core/
│   │   ├── ingestion.py         # PDF/DOCX parsing + chunking
│   │   ├── embeddings.py        # Ollama embedding wrapper
│   │   ├── vectorstore.py       # ChromaDB operations
│   │   ├── retriever.py         # RAG retrieval logic
│   │   ├── llm.py               # Ollama LLM wrapper
│   │   └── prompts.py           # Prompt templates
│   ├── models/                  # Pydantic schemas
│   ├── services/                # Business logic layer
│   └── db/                      # Database setup & CRUD
│
├── frontend/
│   ├── src/
│   │   ├── app/                 # Next.js pages (App Router)
│   │   ├── components/          # React components
│   │   ├── hooks/               # Custom React hooks
│   │   └── lib/                 # Utilities & API client
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── QWEN.md                      # Full project documentation
```

---

## Environment Variables

### Backend (.env)

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_LLM_MODEL=qwen2.5:0.5b
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:0.6b

# ChromaDB
CHROMA_PERSIST_DIR=./chroma_db

# Database
SQLITE_DB_PATH=./legal_analyzer.db

# Upload Settings
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=50

# RAG Settings
CHUNK_SIZE=512
CHUNK_OVERLAP=64
TOP_K_RETRIEVAL=5

# CORS
CORS_ORIGINS=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Development Commands

### Backend

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run development server
uvicorn main:app --reload --port 8000

# Run tests (when available)
pytest
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

---

## How It Works

### 1. Document Ingestion
- Accepts: `.pdf`, `.docx`, `.txt`
- Parses with **PyMuPDF** (PDFs) or **python-docx** (DOCX)
- Chunks into **512 tokens** with **64-token overlap**
- Stores in ChromaDB with metadata: `{doc_id, filename, page_num, chunk_index}`

### 2. Clause Extraction
Uses structured LLM output with Pydantic validation:
```python
class ExtractedClause(BaseModel):
    clause_type: Literal["indemnification", "termination", "liability", ...]
    title: str
    content: str
    page_reference: str
    importance: Literal["critical", "important", "standard"]
```

### 3. Risk Flagging
```python
class RiskFlag(BaseModel):
    risk_level: Literal["high", "medium", "low"]
    risk_category: str
    description: str
    citation: str
    recommendation: str
```

### 4. RAG Query Pipeline
```
User Question
    → Embed question (Ollama embeddings)
    → Retrieve top-k chunks from ChromaDB
    → Build context window
    → Send to Ollama LLM with legal prompt template
    → Return answer + source citations
```

---

## Testing Checklist

- [ ] Upload PDF and verify chunk count in ChromaDB
- [ ] Extract clauses and validate Pydantic schema output
- [ ] Ask a question and verify citation is returned
- [ ] Compare two contracts and verify diff output
- [ ] Export PDF and verify it renders correctly
- [ ] Session persists after page refresh

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Support

For issues, questions, or contributions, please open an issue on the GitHub repository.
