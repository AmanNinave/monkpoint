import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import prisma from '../db.js';

class AIService {
  constructor() {
    // Initialize the main MonkPoint AI agent
    this.agent = new Agent({
      name: "MonkPoint AI Assistant",
      instructions: `You are MonkPoint AI, a mindful habit tracking assistant. Your role is to help users with:

1. **Habit Suggestions**: Suggest personalized habits based on user goals and preferences
2. **Progress Analysis**: Analyze user's habit completion patterns and provide insights
3. **Motivational Support**: Provide encouraging messages and spiritual guidance
4. **Goal Setting**: Help users set realistic and meaningful goals
5. **Mood Tracking**: Analyze mood patterns and suggest improvements
6. **Streak Motivation**: Help users maintain and improve their habit streaks

Guidelines:
- Always maintain a calm, supportive, and spiritual tone
- Focus on mindfulness, inner peace, and personal growth
- Provide actionable, specific advice
- Be encouraging but realistic
- Respect user's spiritual journey
- Use meditation and mindfulness principles`,
      tools: [
        this.getUserHabitsTool(),
        this.getUserGoalsTool(),
        this.getUserMoodsTool(),
        this.createHabitSuggestionTool(),
        this.createGoalSuggestionTool()
      ]
    });
  }

  // Tool definitions using the new agents framework
  getUserHabitsTool() {
    return tool({
      name: 'get_user_habits',
      description: 'Get user\'s current habits and their completion status',
      parameters: z.object({
        userId: z.string().describe('The user\'s ID')
      }),
      execute: async ({ userId }) => {
        return await this.getUserHabits(userId);
      }
    });
  }

  getUserGoalsTool() {
    return tool({
      name: 'get_user_goals',
      description: 'Get user\'s current goals and progress',
      parameters: z.object({
        userId: z.string().describe('The user\'s ID')
      }),
      execute: async ({ userId }) => {
        return await this.getUserGoals(userId);
      }
    });
  }

  getUserMoodsTool() {
    return tool({
      name: 'get_user_moods',
      description: 'Get user\'s mood tracking data',
      parameters: z.object({
        userId: z.string().describe('The user\'s ID'),
        days: z.number().nullable().describe('Number of days to look back (default: 7)')
      }),
      execute: async ({ userId, days = 7 }) => {
        return await this.getUserMoods(userId, days);
      }
    });
  }

  createHabitSuggestionTool() {
    return tool({
      name: 'create_habit_suggestion',
      description: 'Create a new habit suggestion for the user',
      parameters: z.object({
        userId: z.string().describe('The user\'s ID'),
        name: z.string().describe('Name of the habit'),
        description: z.string().describe('Description of the habit'),
        category: z.string().describe('Category of the habit (e.g., \'Mindfulness\', \'Health\', \'Spiritual\')'),
        frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']).describe('How often the habit should be performed')
      }),
      execute: async ({ userId, name, description, category, frequency }) => {
        return await this.createHabitSuggestion(userId, { name, description, category, frequency });
      }
    });
  }

  createGoalSuggestionTool() {
    return tool({
      name: 'create_goal_suggestion',
      description: 'Create a new goal suggestion for the user',
      parameters: z.object({
        userId: z.string().describe('The user\'s ID'),
        title: z.string().describe('Title of the goal'),
        description: z.string().describe('Description of the goal'),
        targetValue: z.number().describe('Target value for the goal'),
        unit: z.string().describe('Unit of measurement')
      }),
      execute: async ({ userId, title, description, targetValue, unit }) => {
        return await this.createGoalSuggestion(userId, { title, description, targetValue, unit });
      }
    });
  }

  // Initialize AI Assistant (simplified with new framework)
  async initializeAssistant() {
    try {
      console.log('MonkPoint AI Agent initialized successfully');
      return 'agent-initialized';
    } catch (error) {
      console.error('Error initializing AI agent:', error);
      throw new Error('Failed to initialize AI agent');
    }
  }

  // Create a new conversation thread (simplified with new framework)
  async createThread() {
    try {
      // With the new agents framework, we don't need explicit thread management
      return `thread-${Date.now()}`;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create conversation thread');
    }
  }

  // Send message to AI assistant using the new agents framework
  async sendMessage(threadId, message, userId) {
    try {
      // Use the new agents framework to run the agent
      const result = await run(this.agent, message, {
        // Pass user context
        userContext: { userId },
        // Set environment variables for the agent
        env: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY
        }
      });
      
      return {
        content: result.finalOutput,
        threadId: threadId
      };
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw new Error('Failed to send message to AI assistant');
    }
  }

  // Get AI insights and recommendations using the new agents framework
  async getInsights(userId) {
    try {
      const prompt = `Based on this user's data, provide personalized insights and recommendations:

User ID: ${userId}

Please analyze their habits, goals, and mood patterns to provide:
1. Key insights about their progress
2. Areas for improvement
3. Motivational message
4. Specific recommendations for the next week

Keep it concise, supportive, and actionable.`;

      const result = await run(this.agent, prompt, {
        userContext: { userId },
        env: {
          OPENAI_API_KEY: process.env.OPENAI_API_KEY
        }
      });
      
      return {
        insights: result.finalOutput,
        threadId: `insights-${Date.now()}`
      };
    } catch (error) {
      console.error('Error getting AI insights:', error);
      throw new Error('Failed to get AI insights');
    }
  }

  // Function implementations
  async getUserHabits(userId) {
    try {
      const habits = await prisma.habit.findMany({
        where: { userId, isActive: true },
        include: {
          category: true,
          entries: {
            where: {
              date: {
                gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
              }
            }
          }
        }
      });

      return {
        habits: habits.map(habit => ({
          id: habit.id,
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          category: habit.category?.name,
          completionRate: this.calculateCompletionRate(habit.entries, habit.frequency)
        }))
      };
    } catch (error) {
      console.error('Error getting user habits:', error);
      return { error: 'Failed to get user habits' };
    }
  }

  async getUserGoals(userId) {
    try {
      const goals = await prisma.goal.findMany({
        where: { userId, status: 'ACTIVE' }
      });

      return {
        goals: goals.map(goal => ({
          id: goal.id,
          title: goal.title,
          description: goal.description,
          progress: (goal.currentValue / goal.targetValue) * 100,
          status: goal.status
        }))
      };
    } catch (error) {
      console.error('Error getting user goals:', error);
      return { error: 'Failed to get user goals' };
    }
  }

  async getUserMoods(userId, days = 7) {
    try {
      const moods = await prisma.mood.findMany({
        where: {
          userId,
          date: {
            gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000)
          }
        },
        orderBy: { date: 'desc' }
      });

      const averageMood = moods.length > 0 
        ? moods.reduce((sum, mood) => sum + mood.rating, 0) / moods.length 
        : 0;

      return {
        moods: moods.map(mood => ({
          date: mood.date,
          rating: mood.rating,
          notes: mood.notes,
          tags: mood.tags
        })),
        averageMood: Math.round(averageMood * 10) / 10,
        totalEntries: moods.length
      };
    } catch (error) {
      console.error('Error getting user moods:', error);
      return { error: 'Failed to get user moods' };
    }
  }

  async createHabitSuggestion(userId, { name, description, category, frequency }) {
    try {
      // Find or create category
      let categoryRecord = await prisma.category.findFirst({
        where: { name: category }
      });

      if (!categoryRecord) {
        categoryRecord = await prisma.category.create({
          data: { name: category }
        });
      }

      // Create habit
      const habit = await prisma.habit.create({
        data: {
          userId,
          categoryId: categoryRecord.id,
          name,
          description,
          frequency
        }
      });

      return {
        success: true,
        habit: {
          id: habit.id,
          name: habit.name,
          description: habit.description,
          category: categoryRecord.name,
          frequency: habit.frequency
        }
      };
    } catch (error) {
      console.error('Error creating habit suggestion:', error);
      return { error: 'Failed to create habit suggestion' };
    }
  }

  async createGoalSuggestion(userId, { title, description, targetValue, unit }) {
    try {
      const goal = await prisma.goal.create({
        data: {
          userId,
          title,
          description,
          targetValue,
          unit
        }
      });

      return {
        success: true,
        goal: {
          id: goal.id,
          title: goal.title,
          description: goal.description,
          targetValue: goal.targetValue,
          unit: goal.unit
        }
      };
    } catch (error) {
      console.error('Error creating goal suggestion:', error);
      return { error: 'Failed to create goal suggestion' };
    }
  }

  // Helper method to calculate completion rate
  calculateCompletionRate(entries, frequency) {
    if (!entries || entries.length === 0) return 0;
    
    const days = frequency === 'DAILY' ? 7 : frequency === 'WEEKLY' ? 4 : 1;
    const expectedEntries = days;
    const actualEntries = entries.length;
    
    return Math.round((actualEntries / expectedEntries) * 100);
  }

}

export default new AIService();
