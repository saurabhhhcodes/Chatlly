from fastapi import APIRouter, Depends
from core.models import ChatRequest, ChatResponse
from core.auth import User, get_current_user
from core.settings import settings
import google.generativeai as genai

router = APIRouter(tags=["chat"])
genai.configure(api_key=settings.GEMINI_API_KEY)

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        model = genai.GenerativeModel(model_name=settings.ANSWER_MODEL)
        resp = model.generate_content(f"Please answer this question: {req.query}")
        answer = resp.text
        citations = []
        return {"answer": answer, "citations": citations}
    except Exception as e:
        return {"answer": f"Sorry, I encountered an error: {str(e)}", "citations": []}