from fastapi import APIRouter
from core.settings import settings
import google.generativeai as genai

router = APIRouter(tags=["test"])

@router.get("/test-gemini")
def test_gemini():
    try:
        if not settings.GEMINI_API_KEY:
            return {"status": "error", "message": "GEMINI_API_KEY not configured"}
        
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        response = model.generate_content("Say hello")
        
        return {
            "status": "success", 
            "message": "Gemini API working",
            "response": response.text
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}