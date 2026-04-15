# Render Backend Deployment Guide

## 🚀 Deploy Backend to Render

### Step 1: Prepare Your Backend for Render

Your backend is already configured! Just ensure these files exist:

**Required Files:**
- `server/package.json` ✅ (already exists)
- `server/src/server.js` ✅ (already exists)
- `server/.env` ✅ (already exists)

### Step 2: Create Render Account & Service

1. **Sign up/Login to Render**
   - Go to: https://render.com
   - Sign up with GitHub (recommended)

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repo: `Opathak449/Food-Donation-Application`
   - Configure build settings:

### Step 3: Render Configuration

**Build Command:**
```
cd server && npm install
```

**Start Command:**
```
cd server && npm start
```

**Environment:**
- **Runtime**: Node
- **Build Environment**: Ubuntu (latest)
- **Instance Type**: Free (or Starter for production)

### Step 4: Environment Variables

Set these in Render Dashboard → Your Service → Environment:

```
JWT_SECRET=your_secure_32_character_random_string_here
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend.vercel.app
PORT=10000
```

### Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Get your backend URL: `https://your-app.onrender.com`

### Step 6: Update Frontend

In your Vercel environment variables, update:
```
VITE_API_URL=https://your-app.onrender.com/api
```

## 🔧 Alternative: Deploy Everything to Render

If you prefer Render for everything:

### Option A: Monorepo Setup
Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: foodshare-frontend
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: client/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

  - type: web
    name: foodshare-backend
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: JWT_SECRET
        value: your_secret_here
      - key: NODE_ENV
        value: production
      - key: CLIENT_URL
        value: https://foodshare-frontend.onrender.com
```

### Option B: Separate Services
1. Deploy frontend as Static Site
2. Deploy backend as Web Service

## 📊 Render vs Vercel Comparison

| Feature | Render | Vercel |
|---------|--------|--------|
| Backend | ✅ Full server | ⚠️ Serverless only |
| Database | ✅ Persistent | ⚠️ Limited (24-48h) |
| Free Tier | ✅ Generous | ✅ Good |
| Scaling | ✅ Manual/Auto | ✅ Automatic |
| File Uploads | ✅ Easy | ⚠️ Complex |

## 🧪 Testing

After deployment:

```bash
# Test backend health
curl https://your-backend.onrender.com/health

# Test API
curl https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@foodshare.org","password":"password123"}'
```

## 🚨 Important Notes

### Database Persistence
- **Render**: SQLite data persists between deployments
- **Vercel**: SQLite data may be lost (24-48 hour cache)

### CORS Configuration
Update `server/src/app.js` CORS origins:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app',  // Add your Vercel URL
    /\.onrender\.com$/  // Allow all Render domains
  ],
  credentials: true
}));
```

### Environment Variables
- Set `CLIENT_URL` to your frontend URL
- Generate secure `JWT_SECRET` (32+ characters)

## 🎯 Recommendation

**For your use case:**
- **Use Render for backend** if you want persistent database
- **Keep Vercel for frontend** for better performance
- **Consider upgrading to PostgreSQL** for production data persistence

Would you like me to help you set up the specific configuration?