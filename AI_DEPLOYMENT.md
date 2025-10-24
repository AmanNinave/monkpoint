# AI Integration Deployment Guide

## 🚀 Deploy AI Integration to Production

### **Step 1: Set Environment Variables**

#### **In Vercel Dashboard:**
1. Go to your backend project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

**Required Environment Variables:**
- `DATABASE_URL` = `your_database_connection_string`
- `JWT_SECRET` = `your_jwt_secret_here`
- `JWT_EXPIRES_IN` = `7d`
- `OPENAI_API_KEY` = `your_openai_api_key_here`
- `NODE_ENV` = `production`

#### **Get OpenAI API Key:**
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Create a new API key
5. Copy and add to Vercel environment variables

### **Step 2: Redeploy Backend**

```bash
cd backend
vercel --prod
```

### **Step 3: Initialize AI Assistant**

```bash
curl -X POST https://monkpoint-api.vercel.app/api/ai/initialize
```

### **Step 4: Test AI Integration**

#### **Test 1: Create Thread**
```bash
# First, get a valid token by logging in
curl -X POST https://monkpoint-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Use the token from response
curl -X POST https://monkpoint-api.vercel.app/api/ai/thread \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### **Test 2: Send Message**
```bash
curl -X POST https://monkpoint-api.vercel.app/api/ai/message \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"threadId": "thread_xxx", "message": "Help me with meditation"}'
```

#### **Test 3: Get Insights**
```bash
curl -X GET https://monkpoint-api.vercel.app/api/ai/insights \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### **Step 5: Frontend Integration**

#### **Update API Configuration:**
Add AI endpoints to your frontend API configuration:

```javascript
// frontend/src/config/api.js
export const API_ENDPOINTS = {
  // ... existing endpoints
  AI: {
    INITIALIZE: `${API_BASE_URL}/ai/initialize`,
    THREAD: `${API_BASE_URL}/ai/thread`,
    MESSAGE: `${API_BASE_URL}/ai/message`,
    INSIGHTS: `${API_BASE_URL}/ai/insights`,
    HABIT_SUGGESTIONS: `${API_BASE_URL}/ai/suggestions/habits`,
    GOAL_SUGGESTIONS: `${API_BASE_URL}/ai/suggestions/goals`,
    MOOD_ANALYSIS: `${API_BASE_URL}/ai/analysis/mood`,
    MOTIVATION: `${API_BASE_URL}/ai/motivation`,
    HABIT_RECOMMENDATIONS: `${API_BASE_URL}/ai/recommendations/habits`,
    COACHING: `${API_BASE_URL}/ai/coaching`
  }
};
```

### **🔧 AI Features Available:**

#### **1. Personalized Habit Suggestions**
- Analyzes user's current habits and goals
- Suggests new habits based on preferences
- Considers time constraints and difficulty level

#### **2. Goal Setting Assistance**
- Helps users set realistic and meaningful goals
- Provides guidance on goal structure and timelines
- Suggests milestones and checkpoints

#### **3. Mood Analysis**
- Analyzes mood patterns and trends
- Identifies factors affecting emotional well-being
- Provides recommendations for mood improvement

#### **4. Motivational Support**
- Generates personalized motivational messages
- Provides encouragement based on progress
- Offers spiritual and mindful guidance

#### **5. Progress Insights**
- Analyzes habit completion rates
- Identifies patterns and trends
- Provides actionable recommendations

#### **6. Coaching Sessions**
- Provides personalized coaching on specific topics
- Offers structured guidance and support
- Includes mindfulness practices and techniques

### **📊 Database Integration:**

The AI can access and modify:
- **User habits** - Read and create habits
- **User goals** - Read and create goals
- **Mood data** - Analyze mood patterns
- **Habit entries** - Track completion rates
- **Streaks** - Monitor progress

### **💰 Cost Considerations:**

- **OpenAI API costs** based on usage
- **GPT-4o-mini** model for cost efficiency
- **Function calling** for database operations
- **Token usage** optimization

### **🔒 Security:**

- **API key protection** in environment variables
- **User authentication** required for all endpoints
- **Rate limiting** recommended for production
- **Input validation** for all user inputs

### **📋 Deployment Checklist:**

- [ ] OpenAI API key set in Vercel environment variables
- [ ] Backend redeployed with AI routes
- [ ] AI assistant initialized
- [ ] AI endpoints tested
- [ ] Frontend API configuration updated
- [ ] AI features integrated in frontend
- [ ] Cost monitoring set up
- [ ] Rate limiting implemented (optional)

---

**MonkPoint AI** - Your mindful companion for spiritual growth and habit development 🧘‍♂️✨
