import prisma from '../db.js';

// Get calendar data for different views
export const getCalendarData = async (req, res) => {
  try {
    console.log('📅 Fetching calendar data for user:', req.userId);
    console.log('📅 Request body:', req.body);
    
    const { date, view } = req.body;
    const targetDate = new Date(date);
    
    if (!date || !view) {
      return res.status(400).json({ error: 'Date and view are required' });
    }

    const userId = req.userId;
    
    // Get user's habits and entries for the requested period
    let startDate, endDate;
    
    if (view === 'month') {
      startDate = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
      endDate = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);
    } else if (view === 'week') {
      const dayOfWeek = targetDate.getDay();
      startDate = new Date(targetDate);
      startDate.setDate(targetDate.getDate() - dayOfWeek);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (view === 'day') {
      startDate = new Date(targetDate);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(targetDate);
      endDate.setHours(23, 59, 59, 999);
    }

    console.log('📅 Date range:', { startDate, endDate, view });

    // Get habits for the user
    const habits = await prisma.habit.findMany({
      where: {
        userId: userId,
        isActive: true
      },
      include: {
        category: true
      }
    });

    // Get habit entries for the period
    const habitEntries = await prisma.habitEntry.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        habit: true
      }
    });

    // Get mood entries for the period
    const moodEntries = await prisma.mood.findMany({
      where: {
        userId: userId,
        date: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Get goal entries for the period
    const goalEntries = await prisma.goal.findMany({
      where: {
        userId: userId,
        createdAt: {
          gte: startDate,
          lte: endDate
        }
      }
    });

    // Calculate statistics
    const totalActivities = habitEntries.length + moodEntries.length + goalEntries.length;
    const activeDays = new Set(habitEntries.map(entry => entry.date.toDateString())).size;
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
    const consistency = totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

    let responseData = {
      stats: {
        activeDays,
        totalActivities,
        consistency
      }
    };

    if (view === 'month') {
      // Generate calendar grid for month view
      const days = [];
      const firstDay = new Date(startDate);
      firstDay.setDate(1);
      const firstDayOfWeek = firstDay.getDay();
      
      // Add days from previous month
      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = new Date(firstDay);
        day.setDate(day.getDate() - (i + 1));
        days.push({
          day: day.getDate(),
          date: day,
          isCurrentMonth: false,
          activities: 0
        });
      }
      
      // Add days from current month
      for (let i = 1; i <= endDate.getDate(); i++) {
        const day = new Date(startDate.getFullYear(), startDate.getMonth(), i);
        const dayActivities = habitEntries.filter(entry => 
          entry.date.toDateString() === day.toDateString()
        ).length;
        
        days.push({
          day: i,
          date: day,
          isCurrentMonth: true,
          activities: dayActivities
        });
      }
      
      // Add days from next month to complete the grid
      const remainingDays = 42 - days.length; // 6 weeks * 7 days
      for (let i = 1; i <= remainingDays; i++) {
        const day = new Date(endDate);
        day.setDate(day.getDate() + i);
        days.push({
          day: day.getDate(),
          date: day,
          isCurrentMonth: false,
          activities: 0
        });
      }

      responseData.days = days;
    } else if (view === 'week') {
      // Generate week view data
      const weekDays = [];
      const currentStreak = await calculateCurrentStreak(userId);
      
      for (let i = 0; i < 7; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        
        const dayActivities = habitEntries.filter(entry => 
          entry.date.toDateString() === day.toDateString()
        ).length;
        
        const completed = dayActivities > 0;
        
        weekDays.push({
          day: day.getDate(),
          dayName: day.toLocaleDateString('en-US', { weekday: 'short' }),
          date: day,
          activities: dayActivities,
          completed
        });
      }

      responseData.weekDays = weekDays;
      responseData.streak = currentStreak;
    } else if (view === 'day') {
      // Generate day view data
      const dayActivities = habitEntries.filter(entry => 
        entry.date.toDateString() === targetDate.toDateString()
      );
      
      const activitiesScheduled = habits.length;
      
      responseData.dayData = {
        activitiesScheduled,
        activities: dayActivities.map(entry => ({
          id: entry.id,
          habitName: entry.habit.name,
          time: entry.createdAt,
          value: entry.value,
          unit: entry.habit.unit
        }))
      };
    }

    console.log('✅ Calendar data fetched successfully');
    res.json({
      success: true,
      ...responseData
    });
  } catch (error) {
    console.error('❌ Calendar data error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch calendar data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Calculate current streak for the user
async function calculateCurrentStreak(userId) {
  try {
    // Get the most recent habit entries
    const recentEntries = await prisma.habitEntry.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        date: 'desc'
      },
      take: 30 // Check last 30 days
    });

    if (recentEntries.length === 0) return 0;

    // Group entries by date
    const entriesByDate = {};
    recentEntries.forEach(entry => {
      const dateStr = entry.date.toDateString();
      if (!entriesByDate[dateStr]) {
        entriesByDate[dateStr] = [];
      }
      entriesByDate[dateStr].push(entry);
    });

    // Calculate streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();
      
      if (entriesByDate[dateStr] && entriesByDate[dateStr].length > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
}
