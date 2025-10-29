from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import RedirectResponse
from core.settings import settings
from core.models import LoginRequest, SignupRequest
import uuid
import requests
import hashlib
from urllib.parse import quote

router = APIRouter(tags=["auth"])

# Simple in-memory user stores
user_sessions = {}
users_db = {}

@router.post("/signup")
async def signup(req: SignupRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash password (use proper hashing in production)
    password_hash = hashlib.sha256(req.password.encode()).hexdigest()
    
    users_db[req.email] = {
        'name': req.name,
        'email': req.email,
        'password_hash': password_hash,
        'provider': 'email'
    }
    
    session_id = str(uuid.uuid4())
    user_sessions[session_id] = {
        'name': req.name,
        'email': req.email,
        'provider': 'email'
    }
    
    return {"session": session_id, "message": "Account created successfully"}

@router.post("/login")
async def login(req: LoginRequest):
    if req.email not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user = users_db[req.email]
    password_hash = hashlib.sha256(req.password.encode()).hexdigest()
    
    if user['password_hash'] != password_hash:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    session_id = str(uuid.uuid4())
    user_sessions[session_id] = {
        'name': user['name'],
        'email': user['email'],
        'provider': 'email'
    }
    
    return {"session": session_id, "message": "Login successful"}

@router.get("/login/google")
async def login_google(request: Request):
    base_url = str(request.base_url).rstrip('/')
    redirect_uri = f"{base_url}/api/auth/google"
    
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={settings.GOOGLE_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=openid email profile&"
        f"response_type=code"
    )
    return RedirectResponse(url=google_auth_url)

@router.get("/login/microsoft")
async def login_microsoft(request: Request):
    base_url = str(request.base_url).rstrip('/')
    redirect_uri = f"{base_url}/api/auth/microsoft"
    
    microsoft_auth_url = (
        f"https://login.microsoftonline.com/common/oauth2/v2.0/authorize?"
        f"client_id={settings.MICROSOFT_CLIENT_ID}&"
        f"redirect_uri={redirect_uri}&"
        f"scope=openid email profile&"
        f"response_type=code"
    )
    return RedirectResponse(url=microsoft_auth_url)

@router.get("/auth/google")
async def auth_google(request: Request, code: str = None):
    if code:
        try:
            base_url = str(request.base_url).rstrip('/')
            redirect_uri = f"{base_url}/api/auth/google"
            # Use frontend URL for production
            if 'localhost' in base_url:
                frontend_url = base_url.replace(':8000', ':3000')
            else:
                frontend_url = 'https://pal.chatlly.com'
            
            token_data = {
                'client_id': settings.GOOGLE_CLIENT_ID,
                'client_secret': settings.GOOGLE_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
            }
            
            token_response = requests.post('https://oauth2.googleapis.com/token', data=token_data)
            
            if token_response.status_code == 200:
                tokens = token_response.json()
                access_token = tokens.get('access_token')
                
                user_response = requests.get(
                    'https://www.googleapis.com/oauth2/v2/userinfo',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                
                if user_response.status_code == 200:
                    user_info = user_response.json()
                    name = user_info.get('name', 'Google User')
                    email = user_info.get('email', '')
                    
                    session_id = str(uuid.uuid4())
                    user_sessions[session_id] = {
                        'name': name,
                        'email': email,
                        'provider': 'google'
                    }
                    
                    return RedirectResponse(url=f"{frontend_url}/login/success?provider=google&session={session_id}&name={quote(name)}&email={quote(email)}")
        except Exception as e:
            print(f"OAuth error: {e}")
    
    base_url = str(request.base_url).rstrip('/')
    if 'localhost' in base_url:
        frontend_url = base_url.replace(':8000', ':3000')
    else:
        frontend_url = 'https://pal.chatlly.com'
    return RedirectResponse(url=f"{frontend_url}/login/success?provider=google&name=Google%20User")

@router.get("/auth/microsoft")
async def auth_microsoft(request: Request, code: str = None):
    if code:
        try:
            base_url = str(request.base_url).rstrip('/')
            redirect_uri = f"{base_url}/api/auth/microsoft"
            # Use frontend URL for production
            if 'localhost' in base_url:
                frontend_url = base_url.replace(':8000', ':3000')
            else:
                frontend_url = 'https://pal.chatlly.com'
            
            token_data = {
                'client_id': settings.MICROSOFT_CLIENT_ID,
                'client_secret': settings.MICROSOFT_CLIENT_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
            }
            
            token_response = requests.post('https://login.microsoftonline.com/common/oauth2/v2.0/token', data=token_data)
            
            if token_response.status_code == 200:
                tokens = token_response.json()
                access_token = tokens.get('access_token')
                
                user_response = requests.get(
                    'https://graph.microsoft.com/v1.0/me',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                
                if user_response.status_code == 200:
                    user_info = user_response.json()
                    name = user_info.get('displayName', 'Microsoft User')
                    email = user_info.get('mail') or user_info.get('userPrincipalName', '')
                    
                    session_id = str(uuid.uuid4())
                    user_sessions[session_id] = {
                        'name': name,
                        'email': email,
                        'provider': 'microsoft'
                    }
                    
                    return RedirectResponse(url=f"{frontend_url}/login/success?provider=microsoft&session={session_id}&name={quote(name)}&email={quote(email)}")
        except Exception as e:
            print(f"Microsoft OAuth error: {e}")
    
    base_url = str(request.base_url).rstrip('/')
    if 'localhost' in base_url:
        frontend_url = base_url.replace(':8000', ':3000')
    else:
        frontend_url = 'https://pal.chatlly.com'
    return RedirectResponse(url=f"{frontend_url}/login/success?provider=microsoft&name=Microsoft%20User")

@router.get("/me")
async def get_user_info(request: Request, session: str = None):
    # Try to get session from query parameter
    if not session:
        session = request.query_params.get('session')
    
    if session and session in user_sessions:
        return user_sessions[session]
    
    return {
        "name": "Guest User",
        "email": "",
        "provider": "guest"
    }