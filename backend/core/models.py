from pydantic import BaseModel
from typing import List, Optional, Any

class ChatRequest(BaseModel):
    query: str
    top_k: int = 5

class ChatResponse(BaseModel):
    answer: str
    citations: List[dict]

class IngestResponse(BaseModel):
    chunks_ingested: int
    files: int

class User(BaseModel):
    id: int
    email: str
    provider: str

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: str
    provider: str

class Token(BaseModel):
    access_token: str
    token_type: str
