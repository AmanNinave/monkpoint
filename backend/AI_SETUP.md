# AI Integration Setup for MonkPoint

## 🤖 OpenAI Integration

### **Environment Variables Required:**

Add these to your `.env` file and Vercel environment variables:

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

### **Getting OpenAI API Key:**

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key and add it to your environment variables

### **API Endpoints Available:**

#### **1. Initialize AI Assistant**
```bash
POST /api/ai/initialize
```
- Initializes the AI assistant (call once)
- No authentication required

#### **2. Create Conversation Thread**
```bash
POST /api/ai/thread
Authorization: Bearer <token>
```
- Creates a new conversation thread
- Returns thread ID for future messages

#### **3. Send Message to AI**
```bash
POST /api/ai/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "threadId": "thread_xxx",
  "message": "Help me with my meditation practice"
}
```

#### **4. Get AI Insights**
```bash
GET /api/ai/insights
Authorization: Bearer <token>
```
- Analyzes user's habits, goals, and moods
- Provides personalized insights and recommendations

#### **5. Get Habit Suggestions**
```bash
POST /api/ai/suggestions/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "preferences": "meditation, exercise",
  "goals": "mindfulness, health",
  "currentHabits": "daily meditation"
}
```

#### **6. Get Goal Suggestions**
```bash
POST /api/ai/suggestions/goals
Authorization: Bearer <token>
Content-Type: application/json

{
  "timeframe": "3 months",
  "focus": "spiritual growth",
  "currentGoals": "daily meditation"
}
```

#### **7. Analyze Mood Patterns**
```bash
GET /api/ai/analysis/mood?days=30
Authorization: Bearer <token>
```
- Analyzes mood patterns over specified days
- Provides insights and recommendations

#### **8. Get Motivational Message**
```bash
POST /api/ai/motivation
Authorization: Bearer <token>
Content-Type: application/json

{
  "context": "struggling with consistency",
  "streak": "5 days",
  "recentProgress": "completed 3 habits today"
}
```

#### **9. Get Habit Recommendations**
```bash
POST /api/ai/recommendations/habits
Authorization: Bearer <token>
Content-Type: application/json

{
  "category": "mindfulness",
  "difficulty": "beginner",
  "timeAvailable": "10 minutes"
}
```

#### **10. Get AI Coaching Session**
```bash
POST /api/ai/coaching
Authorization: Bearer <token>
Content-Type: application/json

{
  "topic": "overcoming procrastination",
  "duration": "short"
}
```

### **🧘 AI Features:**

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

### **🔧 Technical Implementation:**

#### **AI Service Layer:**
- `services/aiService.js` - Core AI functionality
- OpenAI Assistant integration
- Function calling for database operations
- Thread management for conversations

#### **AI Controller:**
- `controllers/aiController.js` - API endpoints
- Request validation and error handling
- User authentication integration
- Response formatting

#### **AI Routes:**
- `routes/ai.js` - Route definitions
- Authentication middleware
- Parameter validation
- Error handling

### **📊 Database Integration:**

The AI can access and modify:
- **User habits** - Read and create habits
- **User goals** - Read and create goals
- **Mood data** - Analyze mood patterns
- **Habit entries** - Track completion rates
- **Streaks** - Monitor progress

### **🚀 Deployment:**

#### **1. Set Environment Variables:**
```bash
# In Vercel dashboard
OPENAI_API_KEY=sk-your-api-key-here
```

#### **2. Initialize AI Assistant:**
```bash
curl -X POST https://monkpoint-api.vercel.app/api/ai/initialize
```

#### **3. Test AI Integration:**
```bash
# Create thread
curl -X POST https://monkpoint-api.vercel.app/api/ai/thread \
  -H "Authorization: Bearer <token>"

# Send message
curl -X POST https://monkpoint-api.vercel.app/api/ai/message \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"threadId": "thread_xxx", "message": "Help me with meditation"}'
```

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

---

**MonkPoint AI** - Your mindful companion for spiritual growth and habit development 🧘‍♂️✨
