import prisma from '../db.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon,
        color
      }
    });

    res.status(201).json({ category });
  } catch (error) {
    console.error('Create category error:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Category with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to create category' });
    }
  }
};

// Update a category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, color } = req.body;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name,
        description,
        icon,
        color
      }
    });

    res.json({ category });
  } catch (error) {
    console.error('Update category error:', error);
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Category with this name already exists' });
    } else {
      res.status(500).json({ error: 'Failed to update category' });
    }
  }
};

// Delete a category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id }
    });

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
