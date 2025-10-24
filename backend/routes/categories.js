import express from 'express';
const router = express.Router();

// Import controllers
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoriesController.js';

import { verifyToken } from '../middleware/auth.js';

// All routes require authentication
router.use(verifyToken);

// Category CRUD operations
router.get('/', getCategories);
router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
