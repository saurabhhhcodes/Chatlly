from fastapi import APIRouter, Depends
from core.models import ChatRequest, ChatResponse
from core.auth import User, get_current_user
from core.settings import settings
import google.generativeai as genai

router = APIRouter(tags=["chat"])

# Configure Gemini only if API key is available
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)
else:
    print("⚠️ Warning: GEMINI_API_KEY not found in environment variables")

@router.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, current_user: User = Depends(get_current_user)):
    try:
        # Check if API key is configured
        if not settings.GEMINI_API_KEY:
            return {"answer": "❌ Gemini API key not configured. Please check environment variables.", "citations": []}
        
        # Try the most common Gemini model names
        model_names = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
        
        for model_name in model_names:
            try:
                model = genai.GenerativeModel(model_name=model_name)
                response = model.generate_content(req.query)
                
                if response and response.text:
                    return {"answer": response.text, "citations": []}
                    
            except Exception as model_error:
                print(f"Model {model_name} failed: {model_error}")
                continue
        
        # If all models fail, provide helpful response
        return {
            "answer": "🤖 AI service temporarily unavailable. Please try again in a moment or upload a document for document-based Q&A.", 
            "citations": []
        }
        
    except Exception as e:
        print(f"Chat error: {e}")
        return {"answer": f"❌ Error: {str(e)}", "citations": []}