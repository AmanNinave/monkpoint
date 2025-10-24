import OpenAI from 'openai';
import prisma from '../db.js';

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // AI Assistant configuration
    this.assistantConfig = {
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
      model: "gpt-4o-mini",
      tools: [
        {
          type: "function",
          function: {
            name: "get_user_habits",
            description: "Get user's current habits and their completion status",
            parameters: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "The user's ID"
                }
              },
              required: ["userId"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "get_user_goals",
            description: "Get user's current goals and progress",
            parameters: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "The user's ID"
                }
              },
              required: ["userId"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "get_user_moods",
            description: "Get user's mood tracking data",
            parameters: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "The user's ID"
                },
                days: {
                  type: "number",
                  description: "Number of days to look back (default: 7)"
                }
              },
              required: ["userId"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "create_habit_suggestion",
            description: "Create a new habit suggestion for the user",
            parameters: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "The user's ID"
                },
                name: {
                  type: "string",
                  description: "Name of the habit"
                },
                description: {
                  type: "string",
                  description: "Description of the habit"
                },
                category: {
                  type: "string",
                  description: "Category of the habit (e.g., 'Mindfulness', 'Health', 'Spiritual')"
                },
                frequency: {
                  type: "string",
                  enum: ["DAILY", "WEEKLY", "MONTHLY"],
                  description: "How often the habit should be performed"
                }
              },
              required: ["userId", "name", "description", "category", "frequency"]
            }
          }
        },
        {
          type: "function",
          function: {
            name: "create_goal_suggestion",
            description: "Create a new goal suggestion for the user",
            parameters: {
              type: "object",
              properties: {
                userId: {
                  type: "string",
                  description: "The user's ID"
                },
                title: {
                  type: "string",
                  description: "Title of the goal"
                },
                description: {
                  type: "string",
                  description: "Description of the goal"
                },
                targetValue: {
                  type: "number",
                  description: "Target value for the goal"
                },
                unit: {
                  type: "string",
                  description: "Unit of measurement"
                }
              },
              required: ["userId", "title", "description", "targetValue", "unit"]
            }
          }
        }
      ]
    };
  }

  // Initialize AI Assistant
  async initializeAssistant() {
    try {
      // Check if assistant already exists
      const assistants = await this.openai.beta.assistants.list();
      const existingAssistant = assistants.data.find(
        assistant => assistant.name === this.assistantConfig.name
      );

      if (existingAssistant) {
        this.assistantId = existingAssistant.id;
        console.log('Using existing AI assistant:', this.assistantId);
        return this.assistantId;
      }

      // Create new assistant
      const assistant = await this.openai.beta.assistants.create(this.assistantConfig);
      this.assistantId = assistant.id;
      console.log('Created new AI assistant:', this.assistantId);
      return this.assistantId;
    } catch (error) {
      console.error('Error initializing AI assistant:', error);
      throw new Error('Failed to initialize AI assistant');
    }
  }

  // Create a new conversation thread
  async createThread() {
    try {
      const thread = await this.openai.beta.threads.create();
      return thread.id;
    } catch (error) {
      console.error('Error creating thread:', error);
      throw new Error('Failed to create conversation thread');
    }
  }

  // Send message to AI assistant
  async sendMessage(threadId, message, userId) {
    try {
      // Add message to thread
      await this.openai.beta.threads.messages.create(threadId, {
        role: "user",
        content: message
      });

      // Run the assistant
      const run = await this.openai.beta.threads.runs.create(threadId, {
        assistant_id: this.assistantId,
        additional_instructions: `User ID: ${userId}. Use the available functions to help this user with their mindful journey.`
      });

      // Wait for completion
      let runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
      }

      if (runStatus.status === 'requires_action') {
        // Handle function calls
        const toolOutputs = await this.handleFunctionCalls(threadId, run.id, runStatus.required_action.submit_tool_outputs.tool_calls, userId);
        
        // Submit tool outputs
        await this.openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
          tool_outputs: toolOutputs
        });

        // Wait for completion again
        runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
        while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
          await new Promise(resolve => setTimeout(resolve, 1000));
          runStatus = await this.openai.beta.threads.runs.retrieve(threadId, run.id);
        }
      }

      // Get the assistant's response
      const messages = await this.openai.beta.threads.messages.list(threadId);
      const assistantMessage = messages.data[0];
      
      return {
        content: assistantMessage.content[0].text.value,
        threadId: threadId
      };
    } catch (error) {
      console.error('Error sending message to AI:', error);
      throw new Error('Failed to send message to AI assistant');
    }
  }

  // Handle function calls from the AI assistant
  async handleFunctionCalls(threadId, runId, toolCalls, userId) {
    const toolOutputs = [];

    for (const toolCall of toolCalls) {
      try {
        let result;
        
        switch (toolCall.function.name) {
          case 'get_user_habits':
            result = await this.getUserHabits(userId);
            break;
          case 'get_user_goals':
            result = await this.getUserGoals(userId);
            break;
          case 'get_user_moods':
            const days = JSON.parse(toolCall.function.arguments).days || 7;
            result = await this.getUserMoods(userId, days);
            break;
          case 'create_habit_suggestion':
            const habitArgs = JSON.parse(toolCall.function.arguments);
            result = await this.createHabitSuggestion(userId, habitArgs);
            break;
          case 'create_goal_suggestion':
            const goalArgs = JSON.parse(toolCall.function.arguments);
            result = await this.createGoalSuggestion(userId, goalArgs);
            break;
          default:
            result = { error: 'Unknown function' };
        }

        toolOutputs.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify(result)
        });
      } catch (error) {
        console.error(`Error handling function call ${toolCall.function.name}:`, error);
        toolOutputs.push({
          tool_call_id: toolCall.id,
          output: JSON.stringify({ error: error.message })
        });
      }
    }

    return toolOutputs;
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

  // Get AI insights and recommendations
  async getInsights(userId) {
    try {
      const habits = await this.getUserHabits(userId);
      const goals = await this.getUserGoals(userId);
      const moods = await this.getUserMoods(userId, 30);

      const prompt = `Based on this user data, provide personalized insights and recommendations:

Habits: ${JSON.stringify(habits)}
Goals: ${JSON.stringify(goals)}
Moods: ${JSON.stringify(moods)}

Provide:
1. Key insights about their progress
2. Areas for improvement
3. Motivational message
4. Specific recommendations for the next week

Keep it concise, supportive, and actionable.`;

      const threadId = await this.createThread();
      const response = await this.sendMessage(threadId, prompt, userId);
      
      return {
        insights: response.content,
        threadId: response.threadId
      };
    } catch (error) {
      console.error('Error getting AI insights:', error);
      throw new Error('Failed to get AI insights');
    }
  }
}

export default new AIService();
