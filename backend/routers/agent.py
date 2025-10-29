# backend/routers/agent.py
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from core.auth import get_current_user
from core.models import User
from agent.agent import run_agent

router = APIRouter(tags=["agent"])

class AgentReq(BaseModel):
    query: str

@router.post("/agent-chat")
def agent_chat(req: AgentReq, current_user: User = Depends(get_current_user)):
    return run_agent(req.query)
