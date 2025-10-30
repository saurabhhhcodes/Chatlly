from fastapi import APIRouter, Depends
from core.models import ChatRequest, ChatResponse
from core.auth import User, get_current_user
from core.settings import settings
import google.generativeai as genai

router = APIRouter(tags=["chat"])

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        if not settings.GEMINI_API_KEY:
            return {"answer": "❌ Gemini API key not configured.", "citations": []}
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        model_names = ["gemini-1.5-flash-latest", "gemini-1.5-pro-latest", "gemini-pro"]
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name=model_name)
                response = model.generate_content(req.query)
                
                if response and response.text:
                    return {"answer": response.text, "citations": []}
                    
            except Exception as model_error:
                print(f"Model {model_name} failed: {model_error}")
                continue
        
        return {"answer": f"🤖 All Gemini models failed. Query: '{req.query}'", "citations": []}
        
    except Exception as e:
        print(f"Chat error: {e}")
        return {"answer": f"❌ Error: {str(e)}", "citations": []}
