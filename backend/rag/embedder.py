import hashlib
from typing import List, Dict
from core.settings import settings
import google.generativeai as genai

genai.configure(api_key=settings.GEMINI_API_KEY)
_CACHE: Dict[str, List[float]] = {}

def _h(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

def embed_texts(texts: List[str]) -> List[List[float]]:
    to_query, order = [], []
    for t in texts:
        h = _h(t)
        if h not in _CACHE:
            to_query.append(t)
            order.append(h)
    if to_query:
        for i, text in enumerate(to_query):
            resp = genai.embed_content(model=settings.EMBED_MODEL, content=text)
            _CACHE[order[i]] = resp['embedding']
    return [_CACHE[_h(t)] for t in texts]
