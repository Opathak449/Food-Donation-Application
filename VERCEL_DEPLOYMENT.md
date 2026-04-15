# Vercel Full-Stack Deployment Guide

## Setup Complete! Here's what was configured:

### 📁 Project Structure
```
project/
├── api/                          # Backend API (Vercel serverless functions)
│   └── index.js                  # Express app handler
├── client/                       # React frontend
│   ├── src/
│   ├── vite.config.js           # Updated with build config
│   └── package.json
├── server/                       # Original backend code
│   ├── src/
│   ├── package.json
│   └── .env
├── vercel.json                  # Deployment configuration
└── .gitignore                   # Updated for dist files
```

## 🚀 Steps to Deploy to Vercel

### 1. Install Vercel CLI (if not already installed)
```bash
npm install -g vercel
```

### 2. Push to GitHub
```bash
git add .
git commit -m "Setup full-stack Vercel deployment"
git push origin main
```

### 3. Deploy to Vercel
Option A: **Using GitHub** (Recommended - Automatic Deployments)
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel will auto-detect the configuration
4. Click Deploy

Option B: **Using CLI**
```bash
vercel --prod
```

### 4. Set Environment Variables in Vercel Dashboard
After deployment, go to your Vercel project:
1. Settings → Environment Variables
2. Add these variables:
   - `JWT_SECRET` = (your secure JWT secret key)
   - `JWT_EXPIRES_IN` = `7d`
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = (your Vercel frontend URL)

### 5. Your Deployment URLs
After deployment, Vercel will give you:
- **Frontend**: `https://your-project.vercel.app`
- **API**: `https://your-project.vercel.app/api`

## ⚠️ Important Notes

### Database Persistence
The current setup uses SQLite, which works on Vercel but has limitations:
- Data persists between deployments within 24-48 hours (Vercel caches filesystem)
- Data is NOT guaranteed to persist long-term

**For Production, Consider:**
- PostgreSQL (Railway, Supabase, AWS RDS)
- MongoDB (MongoDB Atlas)
- Firebase Firestore

### How It Works on Vercel
1. **Frontend**: React app built to static files and served from `client/dist/`
2. **Backend**: Express app runs as serverless functions in `/api/`
3. **Requests**: All `/api/*` routes are handled by your Express backend
4. **Static Files**: Everything else serves the React app (SPA routing)

## 🔗 Environment Variables Template
Create or update your `server/.env` with:
```
PORT=3000
JWT_SECRET=your_secure_32_character_random_string_here
JWT_EXPIRES_IN=7d
NODE_ENV=production
CLIENT_URL=https://your-project.vercel.app
```

## ✅ Testing Before Deploy
```bash
# Terminal 1: Start backend
cd server && npm start

# Terminal 2: Start frontend (from project root)
cd client && npm run dev

# Visit http://localhost:5173/
```

## 🐛 Troubleshooting

**Error: "Cannot find module"**
- Make sure all dependencies are in `package.json`
- Run `npm install` in both `server/` and `client/`

**API requests returning 404**
- Check that `client/src/api/axios.js` uses `baseURL: '/api'`
- Verify Vercel routing in `vercel.json`

**Login failing on Vercel**
- Ensure `JWT_SECRET` is set in Vercel Environment Variables
- Check CORS configuration in `api/index.js`

## 📝 Files Modified/Created
- ✅ Created: `vercel.json` - Deployment configuration
- ✅ Created: `api/index.js` - Serverless function entry point
- ✅ Updated: `client/vite.config.js` - Build output configuration
- ✅ Updated: `.gitignore` - Exclude dist files
