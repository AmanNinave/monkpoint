# Environment Variables Setup for MonkPoint Backend

## 🔧 Required Environment Variables

### **For Local Development:**

Create a `.env` file in the `backend` directory with the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackthon_db?schema=public"

# JWT Configuration
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"

# OpenAI Configuration
OPENAI_API_KEY="your_openai_api_key_here"

# Environment
NODE_ENV="development"
PORT=3001
```

### **For Production (Vercel):**

Set these environment variables in your Vercel dashboard:

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add each variable:

| Variable Name | Value | Description |
|---------------|-------|-------------|
| `DATABASE_URL` | `your_production_db_url` | PostgreSQL connection string |
| `JWT_SECRET` | `your_secure_jwt_secret` | Secret key for JWT tokens |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiration time |
| `OPENAI_API_KEY` | `sk-your-openai-key` | OpenAI API key for AI features |
| `NODE_ENV` | `production` | Environment mode |

## 🔑 Getting API Keys

### **OpenAI API Key:**

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add it to your environment variables

**Important:** Keep your API key secure and never commit it to version control.

### **Database URL:**

For production, use a PostgreSQL database service like:
- **Neon** (recommended for Vercel)
- **Supabase**
- **Railway**
- **Heroku Postgres**

Example format:
```
postgresql://username:password@host:port/database?schema=public
```

### **JWT Secret:**

Generate a secure JWT secret:
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Or use any secure random string generator
```

## 🚀 Deployment Steps

### **1. Set Environment Variables in Vercel:**

1. Go to your Vercel project dashboard
2. Click on "Settings"
3. Navigate to "Environment Variables"
4. Add all required variables
5. Make sure to set them for "Production" environment

### **2. Deploy Backend:**

```bash
cd backend
vercel --prod
```

### **3. Initialize AI Assistant:**

After deployment, initialize the AI assistant:

```bash
curl -X POST https://your-backend.vercel.app/api/ai/initialize
```

### **4. Test AI Integration:**

```bash
# Test with authentication
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token from response
curl -X GET https://your-backend.vercel.app/api/ai/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🔒 Security Best Practices

### **Environment Variable Security:**

1. **Never commit `.env` files** to version control
2. **Use strong, unique secrets** for JWT_SECRET
3. **Rotate API keys** regularly
4. **Use different keys** for development and production
5. **Monitor API usage** to prevent abuse

### **OpenAI API Security:**

1. **Set usage limits** in OpenAI dashboard
2. **Monitor API usage** regularly
3. **Use environment-specific keys**
4. **Implement rate limiting** in your application

## 🧪 Testing Environment Variables

### **Check if variables are loaded:**

```javascript
// In your backend code
console.log('OpenAI API Key:', process.env.OPENAI_API_KEY ? 'Set' : 'Not set');
console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'Not set');
```

### **Test AI Service:**

```javascript
// Test OpenAI connection
import aiService from './services/aiService.js';

try {
  const assistantId = await aiService.initializeAssistant();
  console.log('AI Assistant initialized:', assistantId);
} catch (error) {
  console.error('AI initialization failed:', error);
}
```

## 📋 Checklist

### **Local Development:**
- [ ] `.env` file created with all variables
- [ ] OpenAI API key obtained and added
- [ ] Database connection working
- [ ] JWT secret set
- [ ] Backend starts without errors
- [ ] AI service initializes successfully

### **Production Deployment:**
- [ ] All environment variables set in Vercel
- [ ] Database URL points to production database
- [ ] OpenAI API key is valid and active
- [ ] JWT secret is secure and unique
- [ ] Backend deployed successfully
- [ ] AI assistant initialized
- [ ] All AI endpoints working
- [ ] Frontend can connect to backend

---

**MonkPoint Environment Setup** - Your mindful backend is ready! 🧘‍♂️✨
