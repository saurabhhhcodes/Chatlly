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
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name=settings.ANSWER_MODEL,
        tools=FN_MAP.values(),
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
        
        if response.candidates[0].content.parts[0].function_call:
            # The model decided to call a tool.
            # The `enable_automatic_function_calling=True` above will automatically
            # handle the tool calling and send the result back to the model.
            # The next response from the model will contain the answer.
            continue
        else:
            # The model did not call a tool and returned a final answer.
            return {"answer": response.text}

    return {"answer": "I don't know."}