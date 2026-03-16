# QWEN.md — AI-Powered Legal Document Analyzer

## Project Overview
A RAG-based (Retrieval-Augmented Generation) legal document analysis system that allows lawyers and paralegals to upload contracts, NDAs, and legal briefs, then ask natural language questions. The system extracts clauses, flags risks, summarizes obligations, and enables side-by-side document comparison.

---

## Tech Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Next.js (App Router) + Tailwind CSS      |
| Backend     | FastAPI (Python 3.11+)                   |
| LLM         | Local Ollama — `qwen2.5:0.5b`            |
| Embeddings  | Local Ollama — `qwen3-embedding:0.6b`    |
| Vector DB   | ChromaDB (local persistent)              |
| PDF Export  | WeasyPrint or ReportLab                  |
| Session DB  | SQLite (via SQLModel)                    |
| Validation  | Pydantic v2                              |

---

## Project Structure

```
legal-doc-analyzer/
├── backend/
│   ├── main.py                  # FastAPI app entry point
│   ├── config.py                # All env vars and settings
│   ├── requirements.txt
│   │
│   ├── api/
│   │   ├── routes/
│   │   │   ├── documents.py     # Upload, list, delete docs
│   │   │   ├── analysis.py      # Clause extraction, risk flagging
│   │   │   ├── query.py         # Natural language Q&A
│   │   │   ├── compare.py       # Side-by-side comparison
│   │   │   ├── export.py        # PDF report export
│   │   │   └── sessions.py      # User session & history
│   │   └── deps.py              # Shared FastAPI dependencies
│   │
│   ├── core/
│   │   ├── ingestion.py         # PDF/DOCX parsing + chunking
│   │   ├── embeddings.py        # Ollama embedding wrapper
│   │   ├── vectorstore.py       # ChromaDB operations
│   │   ├── retriever.py         # RAG retrieval logic
│   │   ├── llm.py               # Ollama LLM wrapper
│   │   └── prompts.py           # All system & user prompt templates
│   │
│   ├── models/
│   │   ├── document.py          # Document Pydantic models
│   │   ├── clause.py            # Clause extraction schema
│   │   ├── risk.py              # Risk flag schema
│   │   ├── comparison.py        # Comparison result schema
│   │   └── session.py           # Session & history schema
│   │
│   ├── services/
│   │   ├── document_service.py  # Business logic for documents
│   │   ├── analysis_service.py  # Clause + risk analysis
│   │   ├── query_service.py     # Q&A pipeline
│   │   ├── compare_service.py   # Comparison pipeline
│   │   └── export_service.py    # PDF generation
│   │
│   └── db/
│       ├── database.py          # SQLite setup via SQLModel
│       └── crud.py              # DB operations
│
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   │
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx              # Home / Dashboard
│       │   ├── upload/page.tsx       # Document upload
│       │   ├── analyze/[id]/page.tsx # Single doc analysis
│       │   ├── compare/page.tsx      # Side-by-side comparison
│       │   ├── history/page.tsx      # Session history
│       │   └── export/[id]/page.tsx  # Export preview
│       │
│       ├── components/
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   └── ThemeToggle.tsx
│       │   ├── documents/
│       │   │   ├── UploadZone.tsx       # Drag-and-drop upload
│       │   │   ├── DocumentCard.tsx
│       │   │   └── DocumentList.tsx
│       │   ├── analysis/
│       │   │   ├── ClausePanel.tsx      # Extracted clauses display
│       │   │   ├── RiskBadge.tsx        # Risk level indicator
│       │   │   ├── RiskPanel.tsx        # Flagged risks with citations
│       │   │   └── SummaryPanel.tsx     # Obligations summary
│       │   ├── query/
│       │   │   ├── QueryInput.tsx       # Natural language input
│       │   │   ├── AnswerCard.tsx       # Q&A answer with source
│       │   │   └── ChatHistory.tsx      # Previous Q&A in session
│       │   ├── compare/
│       │   │   ├── CompareSelector.tsx  # Pick 2 documents
│       │   │   └── DiffViewer.tsx       # Side-by-side diff
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Badge.tsx
│       │       ├── Modal.tsx
│       │       ├── Spinner.tsx
│       │       └── Tooltip.tsx
│       │
│       ├── hooks/
│       │   ├── useDocuments.ts
│       │   ├── useAnalysis.ts
│       │   ├── useQuery.ts
│       │   └── useSession.ts
│       │
│       └── lib/
│           ├── api.ts           # Axios/fetch API client
│           └── utils.ts
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Core Features & Implementation Notes

### 1. Document Ingestion & Chunking
- Accept: `.pdf`, `.docx`, `.txt`
- Parse with `PyMuPDF` (fitz) for PDFs, `python-docx` for DOCX
- Chunking: **512 tokens** with **64-token overlap** using `langchain_text_splitters.RecursiveCharacterTextSplitter`
- Store chunks in ChromaDB with metadata: `{doc_id, filename, page_num, chunk_index}`

### 2. Clause Extraction (Structured Output)
Use Pydantic model + Ollama structured output:
```python
class ExtractedClause(BaseModel):
    clause_type: Literal["indemnification", "termination", "liability", "payment", "confidentiality", "governing_law", "dispute_resolution", "IP_ownership", "other"]
    title: str
    content: str
    page_reference: str
    importance: Literal["critical", "important", "standard"]
```

### 3. Risk Flagging
```python
class RiskFlag(BaseModel):
    risk_level: Literal["high", "medium", "low"]
    risk_category: str       # e.g. "Uncapped liability", "Auto-renewal clause"
    description: str
    citation: str            # Exact paragraph/sentence from document
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

### 5. Side-by-Side Comparison
- Select 2 documents
- Extract clauses from both
- LLM compares clause-by-clause and returns structured diff
- Frontend renders in two-column layout with highlighted differences

### 6. PDF Export
- Compile: summary, extracted clauses, risk flags, Q&A history
- Use `WeasyPrint` to render HTML template → PDF
- Include document metadata, analysis timestamp, and branding header

### 7. Session Memory
- Each browser session gets a UUID
- Store: uploaded docs, Q&A history, analysis results in SQLite
- Persist across page refreshes using session ID in localStorage

---

## Environment Variables (.env)

```
# Backend
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_LLM_MODEL=qwen2.5:0.5b
OLLAMA_EMBEDDING_MODEL=qwen3-embedding:0.6b
CHROMA_PERSIST_DIR=./chroma_db
SQLITE_DB_PATH=./legal_analyzer.db
UPLOAD_DIR=./uploads
MAX_UPLOAD_SIZE_MB=50
CHUNK_SIZE=512
CHUNK_OVERLAP=64
TOP_K_RETRIEVAL=5
CORS_ORIGINS=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## API Endpoints

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

## Prompts Architecture

All prompts in `backend/core/prompts.py`:

- `CLAUSE_EXTRACTION_PROMPT` — Extract structured clauses
- `RISK_FLAGGING_PROMPT` — Identify risks with citations
- `SUMMARY_PROMPT` — Summarize obligations and key terms
- `QA_PROMPT` — Answer user questions using retrieved context
- `COMPARISON_PROMPT` — Compare clauses across two documents

Each prompt includes: role instruction, output format specification, and few-shot example where needed.

---

## Development Commands

```bash
# Start Ollama (make sure models are pulled)
ollama pull qwen2.5:0.5b
ollama pull qwen3-embedding:0.6b
ollama serve

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev
```

---

## Key Libraries (Backend requirements.txt)

```
fastapi>=0.111.0
uvicorn[standard]>=0.29.0
python-multipart>=0.0.9
pydantic>=2.7.0
sqlmodel>=0.0.19
PyMuPDF>=1.24.0
python-docx>=1.1.0
langchain-text-splitters>=0.2.0
chromadb>=0.5.0
ollama>=0.2.0
weasyprint>=62.0
python-jose>=3.3.0
httpx>=0.27.0
aiofiles>=23.2.1
```

---

## Code Quality Rules
- All backend functions must have type hints
- All Pydantic models must be in `/models/`
- No business logic in route handlers — always delegate to services
- Every service function must handle exceptions and return structured errors
- Frontend components must be typed with TypeScript interfaces
- Use `async/await` throughout — no blocking calls in FastAPI

---

## Testing Checklist
- [ ] Upload PDF and verify chunk count in ChromaDB
- [ ] Extract clauses and validate Pydantic schema output
- [ ] Ask a question and verify citation is returned
- [ ] Compare two contracts and verify diff output
- [ ] Export PDF and verify it renders correctly
- [ ] Session persists after page refresh
