# CORS Fix for Production Deployment

## 🚨 Issue
Getting CORS error when frontend at `https://monkpoint.vercel.app` tries to call backend at `https://monkpoint-api.vercel.app`

## ✅ Solution

### 1. Backend CORS Configuration Updated
The backend now includes your frontend domain in CORS settings:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://monkpoint.vercel.app',
    'https://monkpoint-frontend.vercel.app'
  ],
  credentials: true
}));
```

### 2. Redeploy Backend
```bash
cd backend
vercel --prod
```

### 3. Frontend Environment Variable
Set the environment variable in your Vercel frontend dashboard:

**Variable Name:** `VITE_API_BASE_URL`  
**Value:** `https://monkpoint-api.vercel.app/api`

### 4. Redeploy Frontend
After setting the environment variable, redeploy your frontend.

## 🔍 Verification

Test the API directly:
```bash
curl -X POST https://monkpoint-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

## 📋 Checklist
- [ ] Backend redeployed with updated CORS
- [ ] Frontend environment variable set
- [ ] Frontend redeployed
- [ ] CORS error resolved
- [ ] API calls working from production frontend
