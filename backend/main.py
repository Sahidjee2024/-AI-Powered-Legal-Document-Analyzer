from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from config import settings
from db.database import init_db
from api.routes import documents, analysis, query, compare, export, sessions
import os


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    os.makedirs(settings.upload_dir, exist_ok=True)
    os.makedirs(settings.chroma_persist_dir, exist_ok=True)
    init_db()
    yield
    # Shutdown (nothing needed)


app = FastAPI(
    title="Legal Document Analyzer API",
    version="1.0.0",
    lifespan=lifespan
)

origins = settings.cors_origins.split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(documents.router, prefix="/api")
app.include_router(analysis.router, prefix="/api")
app.include_router(query.router, prefix="/api")
app.include_router(compare.router, prefix="/api")
app.include_router(export.router, prefix="/api")
app.include_router(sessions.router, prefix="/api")


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})


@app.get("/health")
async def health_check():
    return {"status": "ok", "version": "1.0.0"}
