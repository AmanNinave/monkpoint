# AI Frontend Integration Test Guide

## 🧪 Testing AI Integration

### **1. Test Chatbot Functionality**

#### **Step 1: Login to the Application**
1. Go to `https://monkpoint.vercel.app/login`
2. Login with your credentials
3. You should see the chatbot button in the bottom-right corner

#### **Step 2: Test Chatbot**
1. Click the chatbot button (🧘 icon)
2. The chatbot window should open
3. Try sending a message: "Hello, can you help me with my meditation practice?"
4. You should receive an AI response

#### **Step 3: Test Quick Actions**
1. Click on the quick action buttons:
   - **Insights** - Should ask for progress analysis
   - **Habits** - Should ask for habit suggestions
   - **Goals** - Should ask for goal setting help
   - **Mood** - Should ask for mood analysis
   - **Motivation** - Should ask for motivation
   - **Coaching** - Should ask for coaching

### **2. Test AI Insights Page**

#### **Step 1: Navigate to AI Insights**
1. Click on "AI Insights" in the sidebar
2. You should see the AI Insights page
3. The page should automatically load AI insights

#### **Step 2: Test Refresh Functionality**
1. Click the "Refresh" button
2. New insights should be generated
3. The timestamp should update

#### **Step 3: Test Quick Action Cards**
1. Click on the quick action cards:
   - **Habit Analysis**
   - **Goal Setting**
   - **Mood Tracking**
   - **Habit Suggestions**
   - **Coaching Session**
   - **Motivation**

### **3. Test API Integration**

#### **Test 1: Check if AI Service is Working**
```javascript
// Open browser console and test:
const { aiService } = await import('./src/services/aiService.js');
console.log('AI Service loaded:', aiService);
```

#### **Test 2: Test API Endpoints**
```bash
# Test if AI endpoints are accessible
curl -X GET https://monkpoint-api.vercel.app/api/ai/insights \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### **4. Expected Behavior**

#### **✅ Chatbot Should:**
- Open/close smoothly
- Show welcome message on first open
- Send messages and receive AI responses
- Show loading states
- Handle errors gracefully
- Auto-scroll to new messages

#### **✅ AI Insights Page Should:**
- Load insights automatically
- Show loading state while fetching
- Display insights in a readable format
- Allow refreshing for new insights
- Show error messages if API fails

#### **✅ Quick Actions Should:**
- Trigger appropriate chatbot messages
- Work seamlessly with the chatbot
- Provide relevant AI responses

### **5. Troubleshooting**

#### **If Chatbot Doesn't Open:**
- Check if user is logged in
- Check browser console for errors
- Verify API endpoints are working

#### **If AI Responses Don't Work:**
- Check if OpenAI API key is set in backend
- Verify backend is deployed with AI routes
- Check network tab for API errors

#### **If Insights Page Doesn't Load:**
- Check if user is authenticated
- Verify AI service is properly imported
- Check for CORS issues

### **6. Success Criteria**

- [ ] Chatbot button appears for logged-in users
- [ ] Chatbot opens and closes smoothly
- [ ] Messages are sent and received
- [ ] AI responses are relevant and helpful
- [ ] Quick actions work properly
- [ ] AI Insights page loads and displays content
- [ ] Refresh functionality works
- [ ] Error handling works gracefully
- [ ] All API calls are successful
- [ ] UI is responsive and user-friendly

---

**MonkPoint AI Integration** - Your mindful companion is ready! 🧘‍♂️✨
