import prisma from '../db.js';

// Get all habits for a user
export const getHabits = async (req, res) => {
  try {
    const habits = await prisma.habit.findMany({
      where: { userId: req.userId },
      include: {
        category: true,
        entries: {
          orderBy: { date: 'desc' },
          take: 7 // Last 7 entries
        },
        streaks: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: 'Failed to fetch habits' });
  }
};

// Create a new habit
export const createHabit = async (req, res) => {
  try {
    const { name, description, categoryId, frequency, targetValue, unit, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Habit name is required' });
    }

    const habit = await prisma.habit.create({
      data: {
        userId: req.userId,
        name,
        description,
        categoryId,
        frequency: frequency || 'DAILY',
        targetValue,
        unit,
        icon,
        color,
        isActive: true
      },
      include: {
        category: true
      }
    });

    // Create initial streak record
    await prisma.streak.create({
      data: {
        userId: req.userId,
        habitId: habit.id,
        current: 0,
        longest: 0,
        isActive: true
      }
    });

    res.status(201).json({ habit });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: 'Failed to create habit' });
  }
};

// Update a habit
export const updateHabit = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, categoryId, frequency, targetValue, unit, icon, color, isActive } = req.body;

    const habit = await prisma.habit.update({
      where: { 
        id,
        userId: req.userId // Ensure user owns the habit
      },
      data: {
        name,
        description,
        categoryId,
        frequency,
        targetValue,
        unit,
        icon,
        color,
        isActive
      },
      include: {
        category: true
      }
    });

    res.json({ habit });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: 'Failed to update habit' });
  }
};

// Delete a habit
export const deleteHabit = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.habit.delete({
      where: { 
        id,
        userId: req.userId // Ensure user owns the habit
      }
    });

    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: 'Failed to delete habit' });
  }
};

// Get habit entries for a specific date range
export const getHabitEntries = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { startDate, endDate } = req.query;

    const where = {
      userId: req.userId,
      habitId
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const entries = await prisma.habitEntry.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        habit: true
      }
    });

    res.json({ entries });
  } catch (error) {
    console.error('Get habit entries error:', error);
    res.status(500).json({ error: 'Failed to fetch habit entries' });
  }
};

// Log a habit entry
export const logHabitEntry = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { date, value, notes, mood } = req.body;

    // Check if habit exists and belongs to user
    const habit = await prisma.habit.findFirst({
      where: { 
        id: habitId,
        userId: req.userId,
        isActive: true
      }
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const entryDate = date ? new Date(date) : new Date();
    entryDate.setHours(0, 0, 0, 0); // Start of day

    // Check if entry already exists for this date
    const existingEntry = await prisma.habitEntry.findFirst({
      where: {
        userId: req.userId,
        habitId,
        date: entryDate
      }
    });

    if (existingEntry) {
      // Update existing entry
      const entry = await prisma.habitEntry.update({
        where: { id: existingEntry.id },
        data: { value, notes, mood },
        include: { habit: true }
      });

      res.json({ entry, message: 'Habit entry updated' });
    } else {
      // Create new entry
      const entry = await prisma.habitEntry.create({
        data: {
          userId: req.userId,
          habitId,
          date: entryDate,
          value,
          notes,
          mood
        },
        include: { habit: true }
      });

      // Update streak
      await updateStreak(req.userId, habitId);

      res.status(201).json({ entry, message: 'Habit entry logged' });
    }
  } catch (error) {
    console.error('Log habit entry error:', error);
    res.status(500).json({ error: 'Failed to log habit entry' });
  }
};

// Delete a habit entry
export const deleteHabitEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    await prisma.habitEntry.delete({
      where: { 
        id: entryId,
        userId: req.userId // Ensure user owns the entry
      }
    });

    res.json({ message: 'Habit entry deleted successfully' });
  } catch (error) {
    console.error('Delete habit entry error:', error);
    res.status(500).json({ error: 'Failed to delete habit entry' });
  }
};

// Get habit analytics
export const getHabitAnalytics = async (req, res) => {
  try {
    const { habitId } = req.params;
    const { period = '30' } = req.query; // Default to 30 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const habit = await prisma.habit.findFirst({
      where: { 
        id: habitId,
        userId: req.userId
      },
      include: {
        entries: {
          where: {
            date: { gte: startDate }
          },
          orderBy: { date: 'asc' }
        },
        streaks: true
      }
    });

    if (!habit) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    // Calculate analytics
    const totalEntries = habit.entries.length;
    const completionRate = (totalEntries / parseInt(period)) * 100;
    const currentStreak = habit.streaks[0]?.current || 0;
    const longestStreak = habit.streaks[0]?.longest || 0;

    // Calculate average value if it's a quantitative habit
    let averageValue = null;
    if (habit.targetValue && habit.entries.length > 0) {
      const totalValue = habit.entries.reduce((sum, entry) => sum + (entry.value || 0), 0);
      averageValue = totalValue / habit.entries.length;
    }

    res.json({
      habit: {
        id: habit.id,
        name: habit.name,
        targetValue: habit.targetValue,
        unit: habit.unit
      },
      analytics: {
        totalEntries,
        completionRate: Math.round(completionRate * 100) / 100,
        currentStreak,
        longestStreak,
        averageValue,
        entries: habit.entries
      }
    });
  } catch (error) {
    console.error('Get habit analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch habit analytics' });
  }
};

// Helper function to update streak
const updateStreak = async (userId, habitId) => {
  try {
    const streak = await prisma.streak.findFirst({
      where: { userId, habitId }
    });

    if (!streak) return;

    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if there was an entry yesterday
    const yesterdayEntry = await prisma.habitEntry.findFirst({
      where: {
        userId,
        habitId,
        date: yesterday
      }
    });

    if (yesterdayEntry) {
      // Continue streak
      const newCurrent = streak.current + 1;
      const newLongest = Math.max(newCurrent, streak.longest);
      
      await prisma.streak.update({
        where: { id: streak.id },
        data: {
          current: newCurrent,
          longest: newLongest,
          lastDate: today
        }
      });
    } else {
      // Reset streak
      await prisma.streak.update({
        where: { id: streak.id },
        data: {
          current: 1,
          lastDate: today
        }
      });
    }
  } catch (error) {
    console.error('Update streak error:', error);
  }
};
