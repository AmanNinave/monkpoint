# 🚀 MonkPoint Backend - Vercel Deployment Guide

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI** - Install globally: `npm i -g vercel`
3. **Database** - PostgreSQL database (recommended: Railway, Supabase, or PlanetScale)
4. **Environment Variables** - Prepare your production environment variables

## 🔧 Pre-Deployment Setup

### 1. Database Setup
Choose one of these options:

#### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL service
railway add postgresql

# Get connection string
railway variables
```

#### Option B: Supabase
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy connection string

#### Option C: PlanetScale
1. Go to [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string

### 2. Environment Variables
Create a `.env.production` file with:

```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secure-production-jwt-secret"
JWT_EXPIRES_IN="7d"

# Server
NODE_ENV="production"
PORT=3001

# CORS (Update with your frontend domain)
CORS_ORIGIN="https://your-frontend-domain.vercel.app"
```

## 🚀 Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Initialize Vercel project**
```bash
vercel
```
- Choose your team/account
- Set project name (e.g., `monkpoint-backend`)
- Confirm settings

4. **Set environment variables**
```bash
vercel env add DATABASE_URL
# Paste your database URL

vercel env add JWT_SECRET
# Enter your JWT secret

vercel env add JWT_EXPIRES_IN
# Enter: 7d

vercel env add NODE_ENV
# Enter: production
```

5. **Deploy**
```bash
vercel --prod
```

### Method 2: Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select the `backend` folder as root directory

2. **Configure Build Settings**
   - Framework Preset: `Other`
   - Build Command: `npm run vercel-build`
   - Output Directory: Leave empty
   - Install Command: `npm install`

3. **Set Environment Variables**
   - Go to Project Settings > Environment Variables
   - Add all required environment variables

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete

## 🔧 Post-Deployment Configuration

### 1. Database Migration
After deployment, run database migrations:

```bash
# Using Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

Or use Vercel Functions to run migrations:

```bash
# Create a migration endpoint
curl -X POST https://your-backend.vercel.app/api/migrate
```

### 2. Test Deployment
```bash
# Health check
curl https://your-backend.vercel.app/api/health

# Test authentication
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 3. Update Frontend Configuration (When You Deploy Frontend)
When you deploy your frontend separately, update the API configuration:

```javascript
// frontend/src/config/api.js
export const API_BASE_URL = 'https://your-backend.vercel.app/api';
```

## 🛠️ Vercel Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "index.js",
      "use": "@vercel/node",
      "config": {
        "includeFiles": [
          "prisma/**",
          "controllers/**",
          "routes/**",
          "middleware/**",
          "src/generated/**"
        ]
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "index.js": {
      "maxDuration": 30
    }
  }
}
```

### .vercelignore
```
node_modules/
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.log
coverage/
.nyc_output
.npm
.node_repl_history
*.tgz
.yarn-integrity
.vscode/
.idea/
*.swp
*.swo
.DS_Store
.git/
README.md
DEVELOPMENT_RULES.md
ARCHITECTURE.md
QUICK_REFERENCE.md
test/
tests/
__tests__/
*.test.js
*.spec.js
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Prisma Client Issues
```bash
# Solution: Ensure Prisma generates client during build
# Add to package.json:
"vercel-build": "prisma generate"
```

#### 2. Environment Variables Not Loading
```bash
# Check environment variables in Vercel dashboard
# Ensure they're set for Production environment
```

#### 3. Database Connection Issues
```bash
# Verify DATABASE_URL is correct
# Check database is accessible from Vercel
# Ensure SSL is enabled if required
```

#### 4. CORS Issues
```javascript
// Update CORS configuration in api/index.js
app.use(cors({
  origin: [
    'http://localhost:5173',
    // Add your frontend domain here when you deploy it
  ],
  credentials: true
}));
```

### Debugging Commands
```bash
# Check deployment logs
vercel logs

# Check environment variables
vercel env ls

# Pull environment variables locally
vercel env pull .env.production
```

## 📊 Monitoring & Analytics

### Vercel Analytics
- Go to your project dashboard
- Enable Analytics
- Monitor performance and usage

### Database Monitoring
- Use your database provider's monitoring tools
- Set up alerts for connection issues
- Monitor query performance

## 🔄 Continuous Deployment

### Automatic Deployments
- Push to `main` branch triggers production deployment
- Push to other branches creates preview deployments
- Use Vercel CLI for manual deployments

### Environment Management
- **Production**: `main` branch
- **Preview**: Feature branches
- **Development**: Local development

## 🚨 Security Checklist

- [ ] Strong JWT secret (32+ characters)
- [ ] Secure database connection string
- [ ] CORS properly configured
- [ ] Environment variables secured
- [ ] HTTPS enabled (automatic with Vercel)
- [ ] Database access restricted
- [ ] No sensitive data in logs

## 📝 Post-Deployment Checklist

- [ ] Health endpoint responding
- [ ] Database migrations applied
- [ ] Authentication working
- [ ] All API endpoints functional
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Frontend will be updated with new API URL when deployed separately
- [ ] Monitoring enabled

---

**MonkPoint Backend** - Deployed with mindfulness and spiritual growth in mind 🧘‍♂️✨
