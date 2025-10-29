# backend/agent/agent.py
from typing import Any, Dict, Callable
from core.settings import settings
from agent.tools import retrieve_documents, check_policy
import google.generativeai as genai
from google.generativeai.types import HarmCategory, HarmBlockThreshold

FN_MAP: Dict[str, Callable[..., Any]] = {
    "retrieve_documents": retrieve_documents,
    "check_policy": check_policy,
}

SYSTEM_PROMPT = (
    "You are an Agentic Knowledge Assistant for a regulated industry. "
    "Plan your steps; call tools as needed; cite sources when possible. "
    "If the answer is not supported by retrieved evidence, say you don't know."
)

def run_agent(question: str) -> Dict[str, Any]:
    try:
        if not settings.GEMINI_API_KEY:
            return {"answer": "❌ Gemini API key not configured for agent mode."}
            
        genai.configure(api_key=settings.GEMINI_API_KEY)
        
        # Use Gemini model names, not OpenAI model names
        gemini_models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"]
        
        for model_name in gemini_models:
            try:
                model = genai.GenerativeModel(
                    model_name=model_name,
                    tools=list(FN_MAP.values()),
                    system_instruction=SYSTEM_PROMPT,
                )
                chat = model.start_chat(enable_automatic_function_calling=True)
                
                # Small loop is enough for demo
                for _ in range(6):
                    response = chat.send_message(
                        question,
                        safety_settings={
                            HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT: HarmBlockThreshold.BLOCK_NONE,
                            HarmCategory.HARM_CATEGORY_HARASSMENT: HarmBlockThreshold.BLOCK_NONE,
                            HarmCategory.HARM_CATEGORY_HATE_SPEECH: HarmBlockThreshold.BLOCK_NONE,
                            HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT: HarmBlockThreshold.BLOCK_NONE,
                        },
                    )
                    
                    if response.candidates and len(response.candidates) > 0:
                        parts = response.candidates[0].content.parts
                        if parts and len(parts) > 0 and hasattr(parts[0], 'function_call') and parts[0].function_call:
                            # The model decided to call a tool - continue loop
                            continue
                        else:
                            # The model returned a final answer
                            return {"answer": response.text}
                
                return {"answer": "I don't know."}
                
            except Exception as model_error:
                print(f"Agent model {model_name} failed: {model_error}")
                continue
        
        return {"answer": "🤖 Agent mode temporarily unavailable. Please try regular chat mode."}
        
    except Exception as e:
        print(f"Agent error: {e}")
        return {"answer": f"❌ Agent error: {str(e)}"}