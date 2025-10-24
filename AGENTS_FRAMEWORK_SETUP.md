# OpenAI Agents Framework Setup for MonkPoint

## 🚀 **New AI Framework Integration**

MonkPoint now uses the powerful [OpenAI Agents JS framework](https://github.com/openai/openai-agents-js) for advanced AI capabilities!

### **✨ What's New:**

- **🤖 Multi-Agent Workflows** - Compose and orchestrate multiple agents
- **🔧 Tool Integration** - Seamlessly call functions from within agent responses  
- **🔄 Handoffs** - Transfer control between agents dynamically
- **📊 Structured Outputs** - Support for schema-validated responses
- **🌊 Streaming Responses** - Real-time agent outputs
- **🐛 Tracing & Debugging** - Built-in tracing for agent runs
- **🛡️ Guardrails** - Input and output validation
- **⚡ Parallelization** - Run agents or tool calls in parallel
- **👤 Human-in-the-Loop** - Integrate human approval into workflows

## 🔧 **Setup Instructions**

### **1. Install Dependencies**

The new agents framework is already installed:
```bash
npm install @openai/agents zod@3
```

### **2. Set Environment Variables**

Create or update your `.env` file:

```bash
# OpenAI Configuration
OPENAI_API_KEY="sk-your-openai-api-key-here"

# Database Configuration  
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackthon_db?schema=public"

# JWT Configuration
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"

# Environment
NODE_ENV="development"
PORT=3001
```

### **3. Get OpenAI API Key**

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to "API Keys" section
4. Click "Create new secret key"
5. Copy the key (starts with `sk-`)
6. Add it to your `.env` file

### **4. Test the Setup**

Run the test script to verify everything works:

```bash
cd backend
node test-agents.js
```

### **5. Start the Backend**

```bash
npm run dev
```

## 🧘 **MonkPoint AI Agent Features**

### **🤖 Core Agent Capabilities:**

- **Mindful Conversations** - Spiritual and supportive AI interactions
- **Habit Analysis** - Deep insights into user's habit patterns
- **Goal Guidance** - Help users set and achieve meaningful goals
- **Mood Tracking** - Analyze emotional patterns and suggest improvements
- **Streak Motivation** - Encourage users to maintain their habits
- **Personalized Insights** - Custom recommendations based on user data

### **🔧 Available Tools:**

1. **`get_user_habits`** - Retrieve user's habits and completion status
2. **`get_user_goals`** - Get user's goals and progress
3. **`get_user_moods`** - Access mood tracking data
4. **`create_habit_suggestion`** - Suggest new habits for users
5. **`create_goal_suggestion`** - Help users set new goals

### **📡 API Endpoints:**

- `POST /api/ai/initialize` - Initialize the AI agent
- `POST /api/ai/thread` - Create a conversation thread
- `POST /api/ai/message` - Send message to AI agent
- `GET /api/ai/insights` - Get personalized AI insights
- `POST /api/ai/suggestions/habits` - Get habit suggestions
- `POST /api/ai/suggestions/goals` - Get goal suggestions
- `GET /api/ai/analysis/mood` - Analyze mood patterns
- `POST /api/ai/motivation` - Get motivational messages
- `POST /api/ai/recommendations/habits` - Get habit recommendations
- `POST /api/ai/coaching` - Get personalized coaching

## 🎯 **Usage Examples**

### **Basic Agent Interaction:**

```javascript
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';

const agent = new Agent({
  name: "MonkPoint AI",
  instructions: "You are a mindful habit tracking assistant...",
  tools: [/* your tools */]
});

const result = await run(agent, "Help me with my meditation practice");
console.log(result.finalOutput);
```

### **With Tool Integration:**

```javascript
const habitTool = tool({
  name: 'get_user_habits',
  description: 'Get user habits',
  parameters: z.object({
    userId: z.string()
  }),
  execute: async ({ userId }) => {
    // Your implementation
    return await getUserHabits(userId);
  }
});
```

### **Frontend Integration:**

```javascript
// Send message to AI agent
const response = await fetch('/api/ai/message', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: "Help me set up a morning meditation routine"
  })
});

const data = await response.json();
console.log(data.response); // AI agent response
```

## 🚀 **Deployment**

### **For Production (Vercel):**

1. **Set Environment Variables in Vercel:**
   - `OPENAI_API_KEY` = Your OpenAI API key
   - `DATABASE_URL` = Your production database URL
   - `JWT_SECRET` = Your secure JWT secret
   - `NODE_ENV` = `production`

2. **Deploy Backend:**
   ```bash
   cd backend
   vercel --prod
   ```

3. **Initialize AI Agent:**
   ```bash
   curl -X POST https://your-backend.vercel.app/api/ai/initialize
   ```

## 🔍 **Testing & Debugging**

### **Test Agent Functionality:**

```bash
# Test basic agent
node test-agents.js

# Test with specific user
curl -X POST http://localhost:3001/api/ai/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Help me with my spiritual journey"}'
```

### **Debug Agent Runs:**

The agents framework includes built-in tracing. Check the console for detailed agent execution logs.

## 📚 **Advanced Features**

### **Multi-Agent Workflows:**

```javascript
const meditationAgent = new Agent({
  name: "Meditation Guide",
  instructions: "You specialize in meditation guidance..."
});

const habitAgent = new Agent({
  name: "Habit Coach", 
  instructions: "You help with habit formation..."
});

// Agents can hand off to each other
const mainAgent = Agent.create({
  name: "MonkPoint Main",
  handoffs: [meditationAgent, habitAgent]
});
```

### **Structured Outputs:**

```javascript
const agent = new Agent({
  name: "Goal Setter",
  instructions: "Help users set goals",
  outputType: z.object({
    title: z.string(),
    description: z.string(),
    targetValue: z.number(),
    deadline: z.string()
  })
});
```

### **Streaming Responses:**

```javascript
const result = await run(agent, message, {
  stream: true,
  onUpdate: (update) => {
    console.log('Streaming update:', update);
  }
});
```

## 🧘 **MonkPoint Integration**

The new agents framework is fully integrated with MonkPoint's spiritual theme:

- **🧘 Mindful Conversations** - AI responses maintain spiritual tone
- **📿 Habit Guidance** - Help users cultivate mindful practices  
- **🎯 Goal Setting** - Assist with meaningful life objectives
- **💭 Mood Analysis** - Support emotional well-being
- **🌟 Motivation** - Provide encouraging spiritual guidance

## 🔒 **Security & Best Practices**

- **API Key Security** - Never commit API keys to version control
- **Rate Limiting** - Implement proper rate limiting for AI endpoints
- **User Context** - Always pass user context for personalized responses
- **Error Handling** - Graceful fallbacks for AI service failures
- **Monitoring** - Track AI usage and costs

---

**Namaste! Your mindful AI companion is ready to serve.** 🧘‍♂️✨

For more details, see the [OpenAI Agents JS documentation](https://github.com/openai/openai-agents-js).
