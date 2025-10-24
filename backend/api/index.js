import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import routes
import authRoutes from '../routes/auth.js';
import indexRoutes from '../routes/index.js';
import habitsRoutes from '../routes/habits.js';
import categoriesRoutes from '../routes/categories.js';
import goalsRoutes from '../routes/goals.js';
import moodsRoutes from '../routes/moods.js';
import analyticsRoutes from '../routes/analytics.js';
import testRoutes from '../routes/test.js';
import migrateRoutes from '../routes/migrate.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000',
    // Add your production frontend domain here when you deploy it
  ],
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/habits', habitsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/moods', moodsRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/test', testRoutes);
app.use('/api/migrate', migrateRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for Vercel
export default app;
