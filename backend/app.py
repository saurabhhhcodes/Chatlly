from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from core.settings import settings
from routers.chat import router as chat_router
from routers.ingest import router as ingest_router
from routers.agent import router as agent_router
from routers.uploads import router as uploads_router
from routers.auth import router as auth_router
from routers.test import router as test_router
from core.database import create_db_and_tables

app = FastAPI(title="RAG Agentic Assistant Demo")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ALLOW_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router, prefix="/api")
app.include_router(ingest_router, prefix="/api")
app.include_router(agent_router, prefix="/api")
app.include_router(uploads_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(test_router, prefix="/api")

@app.get("/health")
@app.head("/health")
def health():
    return {"ok": True}
