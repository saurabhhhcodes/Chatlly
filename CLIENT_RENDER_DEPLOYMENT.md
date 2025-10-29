# 🚀 Client Render Deployment Steps

## Step 1: GitHub Setup
1. **Create new repository** in client's GitHub account
2. **Upload project files** (use the zip package provided)
3. **Ensure `.env` is NOT uploaded** (it's in .gitignore)

## Step 2: Render Account Setup
1. **Go to**: https://render.com
2. **Sign up/Login** with client's account
3. **Connect GitHub** account to Render

## Step 3: Deploy Backend Service

### Create Backend Service:
1. **Click**: "New Web Service"
2. **Select**: Client's GitHub repository
3. **Configure**:
   - **Name**: `chatlly-backend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile.backend`
   - **Instance Type**: `Starter ($7/month)` or higher

### Environment Variables:
**Add these in Environment tab**:
```
GEMINI_API_KEY = [Client's Gemini API Key]
GOOGLE_CLIENT_ID = [Client's Google OAuth ID]
GOOGLE_CLIENT_SECRET = [Client's Google OAuth Secret]
MICROSOFT_CLIENT_ID = [Client's Microsoft OAuth ID]
MICROSOFT_CLIENT_SECRET = [Client's Microsoft OAuth Secret]
BEARER_TOKEN = [Generate random 32-char string]
SECRET_KEY = [Generate random 32-char string]
EMBED_MODEL = models/text-embedding-004
ANSWER_MODEL = gemini-1.5-flash
DATA_DIR = /app/data
INDEX_DIR = /app/index_store/chroma_db
```

4. **Click**: "Create Web Service"
5. **Wait**: For deployment (5-10 minutes)
6. **Note**: Backend URL (e.g., `https://chatlly-backend-xyz.onrender.com`)

## Step 4: Deploy Frontend Service

### Create Frontend Service:
1. **Click**: "New Web Service"
2. **Select**: Same GitHub repository
3. **Configure**:
   - **Name**: `chatlly-frontend`
   - **Runtime**: `Docker`
   - **Dockerfile Path**: `./Dockerfile.frontend`
   - **Instance Type**: `Starter ($7/month)` or higher

### Environment Variables:
```
NEXT_PUBLIC_API_BASE = https://[BACKEND-URL]/api
NEXT_PUBLIC_BEARER_TOKEN = [Same as backend BEARER_TOKEN]
```

4. **Click**: "Create Web Service"
5. **Wait**: For deployment (5-10 minutes)

## Step 5: Configure OAuth Providers

### Google OAuth:
1. **Go to**: [Google Cloud Console](https://console.cloud.google.com)
2. **Navigate**: APIs & Services → Credentials
3. **Edit**: OAuth 2.0 Client ID
4. **Add Redirect URI**: `https://[BACKEND-URL]/api/auth/google`

### Microsoft OAuth:
1. **Go to**: [Azure Portal](https://portal.azure.com)
2. **Navigate**: Azure Active Directory → App registrations
3. **Select**: Your app
4. **Add Redirect URI**: `https://[BACKEND-URL]/api/auth/microsoft`

## Step 6: Test Deployment

### Verify Services:
1. **Backend Health**: Visit `https://[BACKEND-URL]/docs`
2. **Frontend**: Visit `https://[FRONTEND-URL]`
3. **OAuth Login**: Test Google and Microsoft login
4. **File Upload**: Test document upload
5. **Chat**: Test AI responses

## 🎯 Final URLs:
- **Application**: `https://chatlly-frontend-xyz.onrender.com`
- **API**: `https://chatlly-backend-xyz.onrender.com`

## 💰 Cost Estimate:
- **Backend**: $7/month (Starter)
- **Frontend**: $7/month (Starter)
- **Total**: $14/month

## 🔧 Troubleshooting:
- **Build fails**: Check Dockerfile paths
- **OAuth errors**: Verify redirect URIs
- **API errors**: Check environment variables
- **Chat not working**: Verify Gemini API key

## 📞 Support:
All configurations are production-ready. Contact for any deployment issues.

**Deployment Time**: ~15-20 minutes total