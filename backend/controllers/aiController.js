import aiService from '../services/aiService.js';

// Initialize AI Assistant
const initializeAI = async (req, res) => {
  try {
    const assistantId = await aiService.initializeAssistant();
    res.json({
      success: true,
      message: 'AI Assistant initialized successfully',
      assistantId
    });
  } catch (error) {
    console.error('AI initialization error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize AI assistant'
    });
  }
};

// Create a new conversation thread
const createThread = async (req, res) => {
  try {
    const threadId = await aiService.createThread();
    res.json({
      success: true,
      threadId,
      message: 'Conversation thread created successfully'
    });
  } catch (error) {
    console.error('Thread creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create conversation thread'
    });
  }
};

// Send message to AI assistant
const sendMessage = async (req, res) => {
  try {
    const { threadId, message } = req.body;
    const userId = req.user.id;

    if (!threadId || !message) {
      return res.status(400).json({
        success: false,
        error: 'Thread ID and message are required'
      });
    }

    const response = await aiService.sendMessage(threadId, message, userId);
    
    res.json({
      success: true,
      response: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Message sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message to AI assistant'
    });
  }
};

// Get AI insights and recommendations
const getInsights = async (req, res) => {
  try {
    const userId = req.user.id;
    const insights = await aiService.getInsights(userId);
    
    res.json({
      success: true,
      insights: insights.insights,
      threadId: insights.threadId
    });
  } catch (error) {
    console.error('Insights generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate AI insights'
    });
  }
};

// Get habit suggestions from AI
const getHabitSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences, goals, currentHabits } = req.body;

    const prompt = `Based on the user's preferences, goals, and current habits, suggest 3-5 new habits that would be beneficial for their mindful journey.

User Preferences: ${preferences || 'Not specified'}
User Goals: ${goals || 'Not specified'}
Current Habits: ${currentHabits || 'None'}

Focus on:
1. Mindfulness and meditation practices
2. Health and wellness habits
3. Spiritual growth activities
4. Habit stacking opportunities
5. Realistic and achievable suggestions

Provide specific, actionable habit suggestions with brief explanations of their benefits.`;

    const threadId = await aiService.createThread();
    const response = await aiService.sendMessage(threadId, prompt, userId);
    
    res.json({
      success: true,
      suggestions: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Habit suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate habit suggestions'
    });
  }
};

// Get goal suggestions from AI
const getGoalSuggestions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeframe, focus, currentGoals } = req.body;

    const prompt = `Based on the user's preferences and current goals, suggest 2-3 meaningful goals for their spiritual and personal development journey.

Timeframe: ${timeframe || 'Not specified'}
Focus Area: ${focus || 'General wellness'}
Current Goals: ${currentGoals || 'None'}

Focus on:
1. Spiritual growth and mindfulness
2. Personal development
3. Health and wellness
4. Relationship and social goals
5. Learning and skill development

Provide specific, measurable goals with clear targets and timelines.`;

    const threadId = await aiService.createThread();
    const response = await aiService.sendMessage(threadId, prompt, userId);
    
    res.json({
      success: true,
      suggestions: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Goal suggestions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate goal suggestions'
    });
  }
};

// Analyze mood patterns and provide insights
const analyzeMoodPatterns = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const prompt = `Analyze the user's mood patterns over the last ${days} days and provide insights and recommendations for improving their emotional well-being.

Focus on:
1. Mood trends and patterns
2. Factors that might influence mood
3. Suggestions for mood improvement
4. Mindfulness practices for emotional regulation
5. Warning signs to watch for

Provide compassionate, supportive analysis with actionable recommendations.`;

    const threadId = await aiService.createThread();
    const response = await aiService.sendMessage(threadId, prompt, userId);
    
    res.json({
      success: true,
      analysis: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Mood analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to analyze mood patterns'
    });
  }
};

// Get motivational message
const getMotivation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { context, streak, recentProgress } = req.body;

    const prompt = `Provide a personalized motivational message for this user based on their current context and progress.

Context: ${context || 'General motivation needed'}
Current Streak: ${streak || 'Not specified'}
Recent Progress: ${recentProgress || 'Not specified'}

Create a message that:
1. Acknowledges their efforts and progress
2. Provides spiritual and mindful encouragement
3. Offers gentle guidance for continued growth
4. Maintains a calm, supportive tone
5. Includes a relevant quote or wisdom

Keep it concise but meaningful (2-3 sentences).`;

    const threadId = await aiService.createThread();
    const response = await aiService.sendMessage(threadId, prompt, userId);
    
    res.json({
      success: true,
      motivation: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Motivation generation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate motivational message'
    });
  }
};

// Get AI-powered habit recommendations
const getHabitRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, difficulty, timeAvailable } = req.body;

    const prompt = `Suggest specific habits for this user based on their preferences and constraints.

Category: ${category || 'General wellness'}
Difficulty Level: ${difficulty || 'Beginner'}
Time Available: ${timeAvailable || 'Flexible'}

Provide 3-5 specific habit recommendations that are:
1. Realistic for their time constraints
2. Appropriate for their difficulty level
3. Aligned with their category preference
4. Beneficial for mindful living
5. Easy to start and maintain

Include brief explanations of benefits and implementation tips.`;

    const threadId = await aiService.createThread();
    const response = await aiService.sendMessage(threadId, prompt, userId);
    
    res.json({
      success: true,
      recommendations: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Habit recommendations error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate habit recommendations'
    });
  }
};

// Get AI coaching session
const getCoachingSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { topic, duration = 'short' } = req.body;

    const prompt = `Provide a personalized coaching session for this user on the topic: "${topic}".

Session Duration: ${duration}

Structure the coaching session to include:
1. Brief assessment of their current situation
2. Key insights and observations
3. Specific actionable steps
4. Mindfulness practices related to the topic
5. Encouragement and motivation
6. Follow-up suggestions

Keep it practical, supportive, and focused on their spiritual growth.`;

    const threadId = await aiService.createThread();
    const response = await aiService.sendMessage(threadId, prompt, userId);
    
    res.json({
      success: true,
      coaching: response.content,
      threadId: response.threadId
    });
  } catch (error) {
    console.error('Coaching session error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate coaching session'
    });
  }
};

export {
  initializeAI,
  createThread,
  sendMessage,
  getInsights,
  getHabitSuggestions,
  getGoalSuggestions,
  analyzeMoodPatterns,
  getMotivation,
  getHabitRecommendations,
  getCoachingSession
};
