# 🧘 MonkPoint - Find Your Inner Peace

A mindful habits tracking application that helps users cultivate spiritual growth through sacred practices and inner reflection.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Development Guidelines](#development-guidelines)
- [API Documentation](#api-documentation)
- [Frontend Structure](#frontend-structure)
- [Backend Structure](#backend-structure)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🎯 Project Overview

MonkPoint is a comprehensive habits tracking application with a monk/spiritual theme that focuses on:
- **Sacred Practices** - Daily habit tracking with spiritual context
- **Inner Reflection** - Mood and emotional journey tracking
- **Sacred Intentions** - Goal setting with mindful purpose
- **Spiritual Journey** - Dashboard with progress analytics
- **Sacred Space** - Personal settings and configuration

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + Vite + Tailwind CSS
- **Backend**: Node.js + Express + ES Modules
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + bcrypt
- **Styling**: Tailwind CSS with monk theme

### Project Structure
```
hackthon/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Main application pages
│   │   ├── services/       # API service layer
│   │   └── config/         # Configuration files
│   └── public/             # Static assets
├── backend/                 # Node.js backend API
│   ├── controllers/        # Business logic controllers
│   ├── routes/            # API route definitions
│   ├── middleware/        # Custom middleware
│   ├── prisma/            # Database schema and migrations
│   └── src/generated/     # Prisma generated client
└── README.md              # This file
```

## 🎨 Design Guidelines

### Color Palette (Monk Theme)
- **Primary**: Amber/Orange (#F59E0B, #D97706)
- **Secondary**: Rose (#F43F5E) - For reflection/emotions
- **Accent**: Emerald (#10B981) - For growth/mindfulness
- **Background**: Warm grays and whites
- **Text**: Dark grays (#1F2937, #374151)

### Typography
- **Headings**: Bold, clean fonts
- **Body**: Readable, peaceful fonts
- **Spiritual Language**: Use mindful, peaceful terminology

### Iconography
- **Meditation Emoji**: 🧘 (primary symbol)
- **Spiritual Symbols**: Third eye, lotus, meditation circles
- **Warm Colors**: Amber, orange, rose tones

## 📱 Frontend Structure

### Pages
- **Journey** (`/dashboard`) - Main dashboard with analytics
- **Practices** (`/habits`) - Sacred daily practices management
- **Intentions** (`/goals`) - Sacred intentions and goal setting
- **Reflection** (`/moods`) - Inner reflection and emotional tracking
- **Sacred Space** (`/settings`) - Personal configuration

### Components
- **Layout** - Main app layout with sidebar
- **Sidebar** - Navigation with monk theme
- **MotivationQuote** - Daily spiritual wisdom
- **HabitCard** - Individual practice display
- **GoalCard** - Intention tracking display
- **MoodEntry** - Reflection logging

### Key Features
- **Responsive Design** - Mobile-first approach
- **Dark Sidebar** - Peaceful navigation
- **Warm Headers** - Motivation quotes with spiritual wisdom
- **Mindful Forms** - Clean, peaceful input design
- **Progress Visualization** - Spiritual growth indicators

## 🔧 Backend Structure

### Controllers
- **authController** - Authentication and user management
- **habitsController** - Sacred practices management
- **goalsController** - Sacred intentions management
- **moodsController** - Inner reflection tracking
- **analyticsController** - Spiritual journey analytics
- **categoriesController** - Practice categorization

### Routes
- `/api/auth/*` - Authentication endpoints
- `/api/habits/*` - Practices management
- `/api/goals/*` - Intentions management
- `/api/moods/*` - Reflection tracking
- `/api/analytics/*` - Journey analytics
- `/api/categories/*` - Practice categories

### Middleware
- **auth.js** - JWT token verification
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security headers
- **Morgan** - Request logging

## 🗄️ Database Schema

### Core Models
- **User** - User accounts with spiritual journey data
- **Habit** - Sacred practices with frequency and targets
- **HabitEntry** - Daily practice completions
- **Streak** - Practice consistency tracking
- **Goal** - Sacred intentions with progress
- **Mood** - Inner reflection entries
- **Category** - Practice categorization
- **Achievement** - Spiritual milestones
- **UserSettings** - Personal sanctuary configuration

### Key Relationships
- User → Habits (one-to-many)
- User → Goals (one-to-many)
- User → Moods (one-to-many)
- Habit → Entries (one-to-many)
- Habit → Streaks (one-to-one)
- User → Settings (one-to-one)

## 🚀 Development Guidelines

### Code Standards
- **ES Modules** - Use import/export syntax
- **Functional Components** - React hooks pattern
- **TypeScript Ready** - Prepare for future migration
- **Clean Code** - Readable, maintainable code
- **Error Handling** - Comprehensive error management

### Naming Conventions
- **Files**: PascalCase for components, camelCase for utilities
- **Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Components**: PascalCase
- **Functions**: camelCase with descriptive names

### Spiritual Terminology
- **Habits** → **Sacred Practices**
- **Goals** → **Sacred Intentions**
- **Moods** → **Inner Reflection**
- **Dashboard** → **Journey**
- **Settings** → **Sacred Space**
- **Progress** → **Spiritual Growth**

## 🔐 Security Guidelines

### Authentication
- **JWT Tokens** - Secure token-based authentication
- **Password Hashing** - bcrypt with salt rounds
- **Token Expiration** - 7-day token lifetime
- **Protected Routes** - Authentication required for all app features

### Data Protection
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection** - Prisma ORM protection
- **XSS Prevention** - Input sanitization
- **CORS Configuration** - Controlled cross-origin access

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User authentication
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Practices Endpoints
- `GET /api/habits` - Get user's sacred practices
- `POST /api/habits` - Create new practice
- `PUT /api/habits/:id` - Update practice
- `DELETE /api/habits/:id` - Delete practice
- `POST /api/habits/:id/entries` - Log practice entry

### Intentions Endpoints
- `GET /api/goals` - Get sacred intentions
- `POST /api/goals` - Create new intention
- `PUT /api/goals/:id` - Update intention
- `PATCH /api/goals/:id/progress` - Update progress

### Reflection Endpoints
- `GET /api/moods` - Get reflection entries
- `POST /api/moods` - Log reflection
- `GET /api/moods/analytics` - Reflection analytics

### Analytics Endpoints
- `GET /api/analytics/dashboard` - Journey overview
- `GET /api/analytics/trends` - Practice trends
- `GET /api/analytics/weekly` - Weekly summary

## 🚀 Deployment

### Environment Variables
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV="production"
```

### Production Checklist
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] SSL certificates installed
- [ ] CORS properly configured
- [ ] Error logging implemented
- [ ] Performance monitoring setup

## 🤝 Contributing

### Development Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run database migrations: `npx prisma migrate dev`
5. Start development servers:
   - Backend: `npm run dev` (port 3001)
   - Frontend: `npm run dev` (port 5177)

### Code Review Process
1. Follow spiritual/monk theme guidelines
2. Maintain clean, readable code
3. Test all functionality
4. Update documentation
5. Ensure responsive design

## 📝 Important Notes

### Theme Consistency
- Always use monk/spiritual terminology
- Maintain warm, peaceful color palette
- Include meditation emoji (🧘) in branding
- Use mindful, peaceful language throughout

### User Experience
- Focus on simplicity and peace
- Provide clear spiritual context
- Encourage mindful reflection
- Support the journey of inner growth

### Technical Requirements
- Mobile-responsive design
- Fast loading times
- Secure authentication
- Reliable data persistence
- Intuitive navigation

---

**MonkPoint** - Where technology meets spirituality for mindful living 🧘‍♂️✨
