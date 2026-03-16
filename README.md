# AI-Powered Legal Document Analyzer

A RAG-based system for lawyers and paralegals to analyze contracts, NDAs, and legal briefs using natural language.

## Features
- Upload PDF, DOCX, or TXT legal documents
- Extract clauses with type, importance, and page reference
- Flag risks with exact citation and recommendation
- Ask natural language questions (RAG-powered)
- Compare two documents side-by-side
- Export full analysis as PDF report
- Session history across page refreshes

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- [Ollama](https://ollama.ai) installed and running

### 1. Pull Ollama models
```bash
ollama pull qwen2.5:0.5b
ollama pull qwen3-embedding:0.6b
```

### 2. Backend
```bash
cd backend
cp .env.example .env
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open
Visit http://localhost:3000

## Docker
```bash
docker-compose up --build
```
Note: Ollama must be running on your host machine.

## API Docs
Swagger UI: http://localhost:8000/docs

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + Tailwind CSS |
| Backend | FastAPI |
| LLM | Ollama qwen2.5:0.5b |
| Embeddings | Ollama qwen3-embedding:0.6b |
| Vector DB | ChromaDB |
| Database | SQLite |
| PDF Export | WeasyPrint |
