import prisma from '../db.js';

// Get mood entries for a user
export const getMoods = async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;

    const where = {
      userId: req.userId
    };

    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }

    const moods = await prisma.mood.findMany({
      where,
      orderBy: { date: 'desc' },
      take: parseInt(limit)
    });

    res.json({ moods });
  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({ error: 'Failed to fetch moods' });
  }
};

// Log a mood entry
export const logMood = async (req, res) => {
  try {
    const { date, rating, notes, tags } = req.body;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ error: 'Rating must be between 1 and 10' });
    }

    const moodDate = date ? new Date(date) : new Date();
    console.log("moodDate: ", moodDate);
    moodDate.setHours(0, 0, 0, 0); // Start of day

    // Check if mood entry already exists for this date
    const existingMood = await prisma.mood.findFirst({
      where: {
        userId: req.userId,
        date: moodDate
      }
    });
    console.log("existingMood: ", existingMood);

    if (existingMood) {
      // Update existing mood
      const mood = await prisma.mood.update({
        where: { id: existingMood.id },
        data: { rating, notes, tags: tags || [] }
      });

      res.json({ mood, message: 'Mood updated' });
    } else {
      // Create new mood entry
      const mood = await prisma.mood.create({
        data: {
          userId: req.userId,
          date: moodDate,
          rating,
          notes,
          tags: tags || []
        }
      });

      res.status(201).json({ mood, message: 'Mood logged' });
    }
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
};

// Get mood analytics
export const getMoodAnalytics = async (req, res) => {
  try {
    const { period = '30' } = req.query; // Default to 30 days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const moods = await prisma.mood.findMany({
      where: {
        userId: req.userId,
        date: { gte: startDate }
      },
      orderBy: { date: 'asc' }
    });

    if (moods.length === 0) {
      return res.json({
        analytics: {
          averageRating: 0,
          totalEntries: 0,
          moodTrend: [],
          commonTags: [],
          weeklyAverage: []
        }
      });
    }

    // Calculate average rating
    const totalRating = moods.reduce((sum, mood) => sum + mood.rating, 0);
    const averageRating = totalRating / moods.length;

    // Get mood trend (last 7 days)
    const last7Days = moods.slice(-7);
    const moodTrend = last7Days.map(mood => ({
      date: mood.date,
      rating: mood.rating
    }));

    // Get common tags
    const allTags = moods.flatMap(mood => mood.tags);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    const commonTags = Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));

    // Calculate weekly averages
    const weeklyAverage = [];
    for (let i = 0; i < Math.ceil(moods.length / 7); i++) {
      const weekMoods = moods.slice(i * 7, (i + 1) * 7);
      if (weekMoods.length > 0) {
        const weekAverage = weekMoods.reduce((sum, mood) => sum + mood.rating, 0) / weekMoods.length;
        weeklyAverage.push({
          week: i + 1,
          average: Math.round(weekAverage * 100) / 100
        });
      }
    }

    res.json({
      analytics: {
        averageRating: Math.round(averageRating * 100) / 100,
        totalEntries: moods.length,
        moodTrend,
        commonTags,
        weeklyAverage
      }
    });
  } catch (error) {
    console.error('Get mood analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch mood analytics' });
  }
};

// Delete a mood entry
export const deleteMood = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.mood.delete({
      where: { 
        id,
        userId: req.userId // Ensure user owns the mood entry
      }
    });

    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ error: 'Failed to delete mood entry' });
  }
};
