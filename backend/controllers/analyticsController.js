import prisma from '../db.js';

// Get dashboard analytics
export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '7' } = req.query; // Default to 7 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get user's habits with recent entries
    const habits = await prisma.habit.findMany({
      where: { 
        userId,
        isActive: true
      },
      include: {
        entries: {
          where: {
            date: { gte: startDate }
          },
          orderBy: { date: 'desc' }
        },
        streaks: true
      }
    });

    // Get recent mood entries
    const moods = await prisma.mood.findMany({
      where: {
        userId,
        date: { gte: startDate }
      },
      orderBy: { date: 'desc' },
      take: 7
    });

    // Get active goals
    const goals = await prisma.goal.findMany({
      where: {
        userId,
        status: 'ACTIVE'
      },
      orderBy: { createdAt: 'desc' }
    });

    // Calculate habit completion rates
    const habitStats = habits.map(habit => {
      const totalDays = parseInt(period);
      const completedDays = habit.entries.length;
      const completionRate = (completedDays / totalDays) * 100;
      const currentStreak = habit.streaks[0]?.current || 0;
      const longestStreak = habit.streaks[0]?.longest || 0;

      return {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        completionRate: Math.round(completionRate * 100) / 100,
        currentStreak,
        longestStreak,
        totalEntries: completedDays,
        lastEntry: habit.entries[0]?.date || null
      };
    });

    // Calculate overall completion rate
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.entries.length, 0);
    const totalPossibleCompletions = totalHabits * parseInt(period);
    const overallCompletionRate = totalPossibleCompletions > 0 
      ? (totalCompletions / totalPossibleCompletions) * 100 
      : 0;

    // Calculate mood analytics
    let averageMood = 0;
    if (moods.length > 0) {
      const totalRating = moods.reduce((sum, mood) => sum + mood.rating, 0);
      averageMood = totalRating / moods.length;
    }

    // Get streak achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
      orderBy: { unlockedAt: 'desc' },
      take: 5
    });

    // Get recent notifications
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    res.json({
      analytics: {
        overallCompletionRate: Math.round(overallCompletionRate * 100) / 100,
        totalHabits,
        totalCompletions,
        averageMood: Math.round(averageMood * 100) / 100,
        habitStats,
        recentMoods: moods.slice(0, 3),
        activeGoals: goals.length,
        goals: goals.slice(0, 3),
        achievements: achievements.map(ua => ({
          id: ua.id,
          name: ua.achievement.name,
          description: ua.achievement.description,
          icon: ua.achievement.icon,
          unlockedAt: ua.unlockedAt,
          isViewed: ua.isViewed
        })),
        notifications: notifications.map(notif => ({
          id: notif.id,
          type: notif.type,
          title: notif.title,
          message: notif.message,
          isRead: notif.isRead,
          createdAt: notif.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Get dashboard analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard analytics' });
  }
};

// Get habit trends over time
export const getHabitTrends = async (req, res) => {
  try {
    const userId = req.userId;
    const { period = '30' } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const habits = await prisma.habit.findMany({
      where: { 
        userId,
        isActive: true
      },
      include: {
        entries: {
          where: {
            date: { gte: startDate }
          },
          orderBy: { date: 'asc' }
        }
      }
    });

    // Group entries by date
    const dateMap = {};
    for (let i = 0; i < parseInt(period); i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = date.toISOString().split('T')[0];
      dateMap[dateKey] = {
        date: dateKey,
        habits: {}
      };
    }

    // Populate habit data for each date
    habits.forEach(habit => {
      habit.entries.forEach(entry => {
        const dateKey = entry.date.toISOString().split('T')[0];
        if (dateMap[dateKey]) {
          dateMap[dateKey].habits[habit.id] = {
            name: habit.name,
            completed: true,
            value: entry.value,
            mood: entry.mood
          };
        }
      });
    });

    // Fill in missing habit data
    const trendData = Object.values(dateMap).map(dayData => {
      const habitData = {};
      habits.forEach(habit => {
        habitData[habit.id] = dayData.habits[habit.id] || {
          name: habit.name,
          completed: false,
          value: null,
          mood: null
        };
      });
      return {
        date: dayData.date,
        habits: habitData
      };
    });

    res.json({ trends: trendData });
  } catch (error) {
    console.error('Get habit trends error:', error);
    res.status(500).json({ error: 'Failed to fetch habit trends' });
  }
};

// Get weekly summary
export const getWeeklySummary = async (req, res) => {
  try {
    const userId = req.userId;
    const { weekStart = '1' } = req.query; // 0 = Sunday, 1 = Monday

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysFromStart = (dayOfWeek - parseInt(weekStart) + 7) % 7;
    
    const weekStartDate = new Date(today);
    weekStartDate.setDate(today.getDate() - daysFromStart);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    weekEndDate.setHours(23, 59, 59, 999);

    // Get habits and their entries for this week
    const habits = await prisma.habit.findMany({
      where: { 
        userId,
        isActive: true
      },
      include: {
        entries: {
          where: {
            date: {
              gte: weekStartDate,
              lte: weekEndDate
            }
          }
        },
        streaks: true
      }
    });

    // Get mood entries for this week
    const moods = await prisma.mood.findMany({
      where: {
        userId,
        date: {
          gte: weekStartDate,
          lte: weekEndDate
        }
      },
      orderBy: { date: 'asc' }
    });

    // Calculate weekly stats
    const weeklyStats = habits.map(habit => {
      const weekEntries = habit.entries.length;
      const completionRate = (weekEntries / 7) * 100;
      const currentStreak = habit.streaks[0]?.current || 0;

      return {
        id: habit.id,
        name: habit.name,
        icon: habit.icon,
        color: habit.color,
        weekEntries,
        completionRate: Math.round(completionRate * 100) / 100,
        currentStreak,
        entries: habit.entries
      };
    });

    // Calculate average mood for the week
    let averageMood = 0;
    if (moods.length > 0) {
      const totalRating = moods.reduce((sum, mood) => sum + mood.rating, 0);
      averageMood = totalRating / moods.length;
    }

    res.json({
      weekSummary: {
        weekStart: weekStartDate,
        weekEnd: weekEndDate,
        totalHabits: habits.length,
        completedHabits: habits.filter(h => h.entries.length > 0).length,
        averageMood: Math.round(averageMood * 100) / 100,
        habitStats: weeklyStats,
        moodData: moods
      }
    });
  } catch (error) {
    console.error('Get weekly summary error:', error);
    res.status(500).json({ error: 'Failed to fetch weekly summary' });
  }
};
