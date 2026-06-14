# Railway deployment setup

This project is ready to deploy the backend to Railway.

## Deploy steps
1. Create a new Railway project and connect this GitHub repository.
2. Set the service root to the repository root.
3. Use the following start command:
   - cd server && npm start
4. Add environment variables:
   - NODE_ENV=production
   - PORT=5000
   - CLIENT_URL=https://food-donation-application-ibnr.vercel.app
   - JWT_SECRET=<your-secret>
5. After Railway gives you a backend URL, set this in Vercel:
   - VITE_API_URL=https://<your-railway-app>.up.railway.app/api
6. Redeploy the Vercel frontend.

## Notes
- The backend listens on the Railway-provided PORT automatically.
- The CORS policy now allows your Vercel frontend origin.
