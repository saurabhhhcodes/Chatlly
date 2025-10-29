# Deployment Guide

## GitHub Setup
1. Create a new repository on GitHub
2. Push code: `git remote add origin https://github.com/YOUR_USERNAME/chatlly.git`
3. Push: `git push -u origin master`

## Render Deployment

### Backend Service
1. Connect your GitHub repo to Render
2. Create a new Web Service
3. Set build command: `cd backend && pip install -r requirements.txt`
4. Set start command: `cd backend && uvicorn app:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `GEMINI_API_KEY`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `MICROSOFT_CLIENT_ID`
   - `MICROSOFT_CLIENT_SECRET`
   - `BEARER_TOKEN`
   - `SECRET_KEY`

### Frontend Service
1. Create another Web Service
2. Set build command: `cd frontend && npm install && npm run build`
3. Set start command: `cd frontend && npm start`
4. Add environment variables:
   - `NEXT_PUBLIC_API_BASE` (set to your backend URL)
   - `NEXT_PUBLIC_BEARER_TOKEN`

### Google OAuth Setup
1. Go to Google Cloud Console
2. Add your Render backend URL to authorized redirect URIs:
   - `https://your-backend-url.onrender.com/api/auth/google`

## Local Testing
```bash
# Backend
cd backend
python3 -m uvicorn app:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm run dev
```

Visit: http://localhost:3000