# 🐳 Docker Deployment Guide for Client

## 📦 **Docker Images Ready**

Your RAG Agentic Knowledge Assistant is now containerized for easy deployment.

## 🚀 **Option 1: Render.com Deployment (Recommended)**

### **Step 1: Upload to Client's GitHub**
1. Create new repository in client's GitHub account
2. Upload all files from this project
3. Ensure `.env` file is NOT uploaded (use environment variables)

### **Step 2: Deploy on Render**
1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Use the `render-deploy.yaml` configuration
4. Set environment variables:
   ```
   GEMINI_API_KEY=your-key
   GOOGLE_CLIENT_ID=your-google-id
   GOOGLE_CLIENT_SECRET=your-google-secret
   MICROSOFT_CLIENT_ID=your-microsoft-id
   MICROSOFT_CLIENT_SECRET=your-microsoft-secret
   BEARER_TOKEN=your-bearer-token
   SECRET_KEY=your-secret-key
   NEXT_PUBLIC_BEARER_TOKEN=your-bearer-token
   ```

## 🐳 **Option 2: Docker Compose (Local/VPS)**

### **Run with Docker Compose:**
```bash
# Clone repository
git clone <repository-url>
cd chatlly

# Set environment variables
cp .env.example .env
# Edit .env with actual values

# Start services
docker-compose -f docker-compose.prod.yml up -d
```

### **Access Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🔧 **Option 3: Individual Docker Images**

### **Build Backend:**
```bash
docker build -f Dockerfile.backend -t chatlly-backend .
docker run -p 8000:8000 --env-file .env chatlly-backend
```

### **Build Frontend:**
```bash
docker build -f Dockerfile.frontend -t chatlly-frontend .
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE=http://localhost:8000/api chatlly-frontend
```

## 📋 **Environment Variables Required**

### **Backend:**
- `GEMINI_API_KEY` - Google Gemini API key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `MICROSOFT_CLIENT_ID` - Microsoft OAuth client ID
- `MICROSOFT_CLIENT_SECRET` - Microsoft OAuth client secret
- `BEARER_TOKEN` - API authentication token
- `SECRET_KEY` - Application secret key

### **Frontend:**
- `NEXT_PUBLIC_API_BASE` - Backend API URL
- `NEXT_PUBLIC_BEARER_TOKEN` - Same as backend bearer token

## 🔒 **Security Notes**
- Never commit `.env` files to version control
- Use environment variables in production
- Ensure OAuth redirect URIs match deployment URLs
- Use HTTPS in production

## 📞 **Support**
- All configurations are production-ready
- Docker images include all dependencies
- OCR and AI capabilities fully integrated
- OAuth flows configured for any domain

**Your application is ready for enterprise deployment!** 🚀