from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from core.settings import settings

security = HTTPBearer()

class User:
    def __init__(self, email: str = "demo@example.com"):
        self.email = email

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    if credentials.credentials != settings.BEARER_TOKEN:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return User()
