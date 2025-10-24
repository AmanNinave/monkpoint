# 🧘 MonkPoint Quick Reference Guide

## 🚀 Quick Start

### Development Setup
```bash
# Clone and setup
git clone <repository>
cd hackthon

# Backend setup
cd backend
npm install
cp .env.example .env
# Edit .env with your database URL
npx prisma migrate dev
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5177
- **Backend**: http://localhost:3001
- **Database**: PostgreSQL on localhost:5432

## 🎨 Spiritual Theme Quick Reference

### Terminology Mapping
| Standard Term | MonkPoint Term |
|---------------|----------------|
| Habits | Sacred Practices |
| Goals | Sacred Intentions |
| Moods | Inner Reflection |
| Dashboard | Journey |
| Settings | Sacred Space |
| Progress | Spiritual Growth |
| Completion | Mindful Achievement |

### Color Palette
```css
/* Primary Colors */
bg-amber-600    /* Main buttons, active states */
text-amber-600  /* Headings, important text */
border-amber-200 /* Subtle borders */

/* Secondary Colors */
bg-rose-600     /* Mood/reflection elements */
bg-emerald-600  /* Growth/progress elements */
bg-orange-600   /* Warm accents */

/* Background Colors */
bg-gray-900     /* Dark sidebar */
bg-white        /* Card backgrounds */
bg-gray-100     /* Page backgrounds */
```

## 🔧 Common Commands

### Backend Commands
```bash
# Start development server
npm run dev

# Database operations
npx prisma migrate dev          # Run migrations
npx prisma generate            # Generate Prisma client
npx prisma db push             # Push schema changes
npx prisma studio              # Open database GUI

# Production
npm start
```

### Frontend Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 File Structure Quick Reference

### Frontend Structure
```
frontend/src/
├── components/
│   ├── Layout.jsx           # Main app layout
│   ├── Sidebar.jsx          # Navigation sidebar
│   └── MotivationQuote.jsx  # Daily wisdom
├── pages/
│   ├── Dashboard.jsx        # Journey overview
│   ├── Habits.jsx          # Sacred practices
│   ├── Goals.jsx           # Sacred intentions
│   ├── Moods.jsx           # Inner reflection
│   └── Settings.jsx        # Sacred space
├── services/
│   └── api.js              # API service layer
└── config/
    └── api.js               # API endpoints
```

### Backend Structure
```
backend/
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── habitsController.js  # Sacred practices logic
│   ├── goalsController.js   # Sacred intentions logic
│   ├── moodsController.js   # Inner reflection logic
│   └── analyticsController.js # Journey analytics
├── routes/
│   ├── auth.js             # Auth endpoints
│   ├── habits.js           # Practices endpoints
│   ├── goals.js            # Intentions endpoints
│   ├── moods.js            # Reflection endpoints
│   └── analytics.js        # Analytics endpoints
├── middleware/
│   └── auth.js             # JWT verification
└── prisma/
    └── schema.prisma       # Database schema
```

## 🔌 API Endpoints Quick Reference

### Authentication
```bash
POST /api/auth/register     # Create account
POST /api/auth/login        # User login
GET  /api/auth/profile      # Get user profile
PUT  /api/auth/profile      # Update profile
PUT  /api/auth/change-password # Change password
```

### Sacred Practices
```bash
GET    /api/habits                    # Get all practices
POST   /api/habits                    # Create practice
PUT    /api/habits/:id                # Update practice
DELETE /api/habits/:id                # Delete practice
POST   /api/habits/:id/entries        # Log practice entry
GET    /api/habits/:id/analytics      # Practice analytics
```

### Sacred Intentions
```bash
GET    /api/goals                    # Get all intentions
POST   /api/goals                     # Create intention
PUT    /api/goals/:id                 # Update intention
DELETE /api/goals/:id                 # Delete intention
PATCH  /api/goals/:id/progress        # Update progress
```

### Inner Reflection
```bash
GET    /api/moods                     # Get reflection entries
POST   /api/moods                     # Log reflection
DELETE /api/moods/:id                 # Delete reflection
GET    /api/moods/analytics           # Reflection analytics
```

### Journey Analytics
```bash
GET    /api/analytics/dashboard       # Journey overview
GET    /api/analytics/trends          # Practice trends
GET    /api/analytics/weekly          # Weekly summary
```

## 🗄️ Database Schema Quick Reference

### Core Models
```prisma
User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

Habit {
  id          String   @id @default(cuid())
  userId      String
  name        String
  description String?
  frequency   HabitFrequency @default(DAILY)
  targetValue Int?
  unit        String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

Goal {
  id            String     @id @default(cuid())
  userId        String
  title         String
  description   String?
  targetValue   Float?
  currentValue  Float      @default(0)
  unit          String?
  deadline      DateTime?
  status        GoalStatus @default(ACTIVE)
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

Mood {
  id        String   @id @default(cuid())
  userId    String
  date      DateTime @db.Date
  rating    Int      // 1-10 scale
  notes     String?
  tags      String[] // Array of mood tags
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🎯 Common Development Tasks

### Adding a New Sacred Practice
```javascript
// Frontend: Create practice form
const handleCreatePractice = async (practiceData) => {
  try {
    const data = await apiService.request('/habits', {
      method: 'POST',
      body: JSON.stringify(practiceData)
    })
    setPractices([data.habit, ...practices])
  } catch (err) {
    setError('Failed to create practice')
  }
}
```

### Logging a Practice Entry
```javascript
// Frontend: Log practice completion
const handleLogEntry = async (habitId, entryData) => {
  try {
    const data = await apiService.request(`/habits/${habitId}/entries`, {
      method: 'POST',
      body: JSON.stringify(entryData)
    })
    // Refresh practices to update streak data
    fetchPractices()
  } catch (err) {
    setError('Failed to log practice entry')
  }
}
```

### Updating Sacred Intention Progress
```javascript
// Frontend: Update goal progress
const handleUpdateProgress = async (goalId, currentValue) => {
  try {
    const data = await apiService.request(`/goals/${goalId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify({ currentValue })
    })
    setGoals(goals.map(g => g.id === goalId ? data.goal : g))
  } catch (err) {
    setError('Failed to update progress')
  }
}
```

## 🧪 Testing Quick Reference

### API Testing with curl
```bash
# Register user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create sacred practice
curl -X POST http://localhost:3001/api/habits \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Morning Meditation","description":"Daily mindfulness practice","frequency":"DAILY"}'

# Log practice entry
curl -X POST http://localhost:3001/api/habits/HABIT_ID/entries \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"value":1,"notes":"Peaceful morning session","mood":8}'
```

## 🚨 Common Issues & Solutions

### Database Connection Issues
```bash
# Check if PostgreSQL is running
brew services list | grep postgresql

# Start PostgreSQL
brew services start postgresql

# Reset database
npx prisma migrate reset
npx prisma migrate dev
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Kill process on port 5177
lsof -ti:5177 | xargs kill -9
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
npx prisma generate

# Reset and migrate
npx prisma migrate reset
npx prisma migrate dev
```

## 📝 Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/monkpoint"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 🎨 UI Component Quick Reference

### Common Tailwind Classes
```css
/* Layout */
flex flex-col h-screen          /* Full height flex column */
grid grid-cols-1 md:grid-cols-2 /* Responsive grid */
space-y-6                      /* Vertical spacing */

/* Colors */
bg-amber-600                   /* Primary amber */
text-amber-600                 /* Amber text */
border-amber-200               /* Amber border */

/* Spacing */
p-6                           /* Padding */
px-4 py-2                     /* Horizontal/vertical padding */
rounded-lg                    /* Rounded corners */

/* States */
hover:bg-amber-700            /* Hover state */
focus:ring-2 focus:ring-amber-500 /* Focus ring */
```

## 🔍 Debugging Tips

### Frontend Debugging
```javascript
// Console logging
console.log('User data:', user)
console.log('API response:', data)

// React DevTools
// Install React Developer Tools browser extension
```

### Backend Debugging
```javascript
// Request logging
console.log('Request body:', req.body)
console.log('User ID:', req.userId)

// Error logging
console.error('Database error:', error)
```

### Database Debugging
```bash
# Open Prisma Studio
npx prisma studio

# Check database connection
npx prisma db pull
```

---

**MonkPoint Quick Reference** - Your spiritual coding companion 🧘‍♂️✨
