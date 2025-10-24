import prisma from '../db.js';

// Get all goals for a user
export const getGoals = async (req, res) => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

// Create a new goal
export const createGoal = async (req, res) => {
  try {
    const { title, description, targetValue, unit, deadline } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Goal title is required' });
    }

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId,
        title,
        description,
        targetValue,
        unit,
        deadline: deadline ? new Date(deadline) : null,
        status: 'ACTIVE'
      }
    });

    res.status(201).json({ goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

// Update a goal
export const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetValue, unit, deadline, status, currentValue } = req.body;

    const goal = await prisma.goal.update({
      where: { 
        id,
        userId: req.userId // Ensure user owns the goal
      },
      data: {
        title,
        description,
        targetValue,
        unit,
        deadline: deadline ? new Date(deadline) : null,
        status,
        currentValue
      }
    });

    res.json({ goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

// Delete a goal
export const deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.goal.delete({
      where: { 
        id,
        userId: req.userId // Ensure user owns the goal
      }
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};

// Update goal progress
export const updateGoalProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentValue } = req.body;

    if (currentValue === undefined) {
      return res.status(400).json({ error: 'Current value is required' });
    }

    const goal = await prisma.goal.findFirst({
      where: { 
        id,
        userId: req.userId
      }
    });

    if (!goal) {
      return res.status(404).json({ error: 'Goal not found' });
    }

    // Check if goal is completed
    let status = goal.status;
    if (goal.targetValue && currentValue >= goal.targetValue && status === 'ACTIVE') {
      status = 'COMPLETED';
    }

    const updatedGoal = await prisma.goal.update({
      where: { id },
      data: {
        currentValue,
        status
      }
    });

    res.json({ goal: updatedGoal });
  } catch (error) {
    console.error('Update goal progress error:', error);
    res.status(500).json({ error: 'Failed to update goal progress' });
  }
};
