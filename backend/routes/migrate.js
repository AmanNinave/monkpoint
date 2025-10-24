import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';

const router = express.Router();
const execAsync = promisify(exec);

// Database migration endpoint (for production setup)
router.post('/', async (req, res) => {
  try {
    console.log('Starting database migration...');
    
    // Run Prisma migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy');
    
    if (stderr) {
      console.error('Migration stderr:', stderr);
    }
    
    console.log('Migration stdout:', stdout);
    
    res.json({
      success: true,
      message: 'Database migration completed successfully',
      output: stdout
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({
      success: false,
      error: 'Migration failed',
      message: error.message
    });
  }
});

// Generate Prisma client endpoint
router.post('/generate', async (req, res) => {
  try {
    console.log('Generating Prisma client...');
    
    const { stdout, stderr } = await execAsync('npx prisma generate');
    
    if (stderr) {
      console.error('Generate stderr:', stderr);
    }
    
    console.log('Generate stdout:', stdout);
    
    res.json({
      success: true,
      message: 'Prisma client generated successfully',
      output: stdout
    });
  } catch (error) {
    console.error('Generate error:', error);
    res.status(500).json({
      success: false,
      error: 'Generate failed',
      message: error.message
    });
  }
});

export default router;
