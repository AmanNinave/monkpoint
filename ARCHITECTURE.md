# 🏗️ MonkPoint Architecture Documentation

## 📋 Table of Contents
- [System Overview](#system-overview)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Database Design](#database-design)
- [API Architecture](#api-architecture)
- [Authentication Flow](#authentication-flow)
- [Data Flow](#data-flow)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

## 🎯 System Overview

MonkPoint is a full-stack web application built with modern technologies, following a monk/spiritual theme for mindful habit tracking.

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (PostgreSQL)  │
│   Port: 5177    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🎨 Frontend Architecture

### Technology Stack
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Lucide React** - Icon library

### Component Structure
```
src/
├── components/           # Reusable UI components
│   ├── Layout.jsx       # Main app layout
│   ├── Sidebar.jsx      # Navigation sidebar
│   ├── MotivationQuote.jsx # Daily wisdom
│   └── ui/              # Base UI components
├── pages/               # Main application pages
│   ├── Dashboard.jsx    # Journey overview
│   ├── Habits.jsx      # Sacred practices
│   ├── Goals.jsx        # Sacred intentions
│   ├── Moods.jsx        # Inner reflection
│   └── Settings.jsx     # Sacred space
├── services/            # API service layer
│   └── api.js          # Centralized API calls
├── config/              # Configuration
│   └── api.js          # API endpoints
└── utils/               # Utility functions
```

### State Management
- **Local State** - React hooks (useState, useEffect)
- **Global State** - Context API (if needed)
- **Server State** - Direct API calls with caching
- **Form State** - Controlled components

### Routing Structure
```
/ (root) → /login (redirect)
/login → Login page
/register → Registration page
/dashboard → Journey overview
/habits → Sacred practices
/goals → Sacred intentions
/moods → Inner reflection
/settings → Sacred space
```

## 🔧 Backend Architecture

### Technology Stack
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Project Structure
```
backend/
├── controllers/         # Business logic
│   ├── authController.js
│   ├── habitsController.js
│   ├── goalsController.js
│   ├── moodsController.js
│   └── analyticsController.js
├── routes/             # API route definitions
│   ├── auth.js
│   ├── habits.js
│   ├── goals.js
│   ├── moods.js
│   └── analytics.js
├── middleware/         # Custom middleware
│   └── auth.js
├── prisma/            # Database schema
│   └── schema.prisma
├── src/generated/     # Prisma client
└── index.js           # Application entry point
```

### API Architecture
```
/api
├── /auth              # Authentication endpoints
│   ├── POST /register
│   ├── POST /login
│   ├── GET /profile
│   └── PUT /profile
├── /habits            # Sacred practices
│   ├── GET /
│   ├── POST /
│   ├── PUT /:id
│   └── DELETE /:id
├── /goals             # Sacred intentions
│   ├── GET /
│   ├── POST /
│   ├── PUT /:id
│   └── PATCH /:id/progress
├── /moods             # Inner reflection
│   ├── GET /
│   ├── POST /
│   └── GET /analytics
└── /analytics         # Journey analytics
    ├── GET /dashboard
    ├── GET /trends
    └── GET /weekly
```

## 🗄️ Database Design

### Core Entities
```mermaid
erDiagram
    User ||--o{ Habit : has
    User ||--o{ Goal : has
    User ||--o{ Mood : has
    User ||--o{ HabitEntry : creates
    User ||--o{ Streak : tracks
    User ||--|| UserSettings : configures
    Habit ||--o{ HabitEntry : contains
    Habit ||--o{ Streak : tracks
    Category ||--o{ Habit : categorizes
```

### Entity Relationships
- **User** (1) → (N) **Habit** - One user has many practices
- **User** (1) → (N) **Goal** - One user has many intentions
- **User** (1) → (N) **Mood** - One user has many reflections
- **Habit** (1) → (N) **HabitEntry** - One practice has many entries
- **Habit** (1) → (1) **Streak** - One practice has one streak
- **User** (1) → (1) **UserSettings** - One user has one settings

### Key Models
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  avatar    String?
  timezone  String   @default("UTC")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  habits        Habit[]
  habitEntries  HabitEntry[]
  streaks       Streak[]
  goals         Goal[]
  moods         Mood[]
  settings      UserSettings?
}

model Habit {
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
  
  // Relations
  user    User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  entries HabitEntry[]
  streaks Streak[]
}
```

## 🔐 Authentication Flow

### Registration Flow
```
1. User submits registration form
2. Frontend validates input
3. Frontend sends POST /api/auth/register
4. Backend validates data
5. Backend hashes password
6. Backend creates user in database
7. Backend generates JWT token
8. Backend returns user data + token
9. Frontend stores token in localStorage
10. Frontend redirects to dashboard
```

### Login Flow
```
1. User submits login form
2. Frontend sends POST /api/auth/login
3. Backend validates credentials
4. Backend verifies password hash
5. Backend generates JWT token
6. Backend returns user data + token
7. Frontend stores token in localStorage
8. Frontend redirects to dashboard
```

### Protected Route Flow
```
1. User navigates to protected route
2. Frontend checks for JWT token
3. If no token → redirect to login
4. If token exists → make API request
5. Backend verifies JWT token
6. If valid → return data
7. If invalid → return 401 error
8. Frontend handles response
```

## 📊 Data Flow

### Sacred Practice Creation
```
1. User fills practice form
2. Frontend validates form data
3. Frontend sends POST /api/habits
4. Backend validates request
5. Backend creates habit in database
6. Backend creates initial streak record
7. Backend returns created habit
8. Frontend updates UI with new habit
```

### Practice Entry Logging
```
1. User logs practice completion
2. Frontend sends POST /api/habits/:id/entries
3. Backend validates entry data
4. Backend creates habit entry
5. Backend updates streak calculation
6. Backend returns updated data
7. Frontend refreshes habit data
```

### Analytics Generation
```
1. User views dashboard
2. Frontend requests GET /api/analytics/dashboard
3. Backend queries user's data
4. Backend calculates completion rates
5. Backend calculates streak data
6. Backend calculates mood averages
7. Backend returns analytics object
8. Frontend displays analytics
```

## 🛡️ Security Architecture

### Authentication Security
- **JWT Tokens** - Stateless authentication
- **Password Hashing** - bcrypt with 12 salt rounds
- **Token Expiration** - 7-day token lifetime
- **Secure Headers** - Helmet.js security headers

### API Security
- **CORS Configuration** - Controlled cross-origin access
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Prisma ORM prevents SQL injection
- **XSS Prevention** - Input sanitization and output encoding

### Data Security
- **Environment Variables** - Sensitive data in .env files
- **Database Encryption** - PostgreSQL encryption at rest
- **HTTPS Only** - SSL/TLS in production
- **Rate Limiting** - Prevent API abuse

## 🚀 Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   Vite Dev      │◄──►│   Node.js       │◄──►│   PostgreSQL    │
│   localhost:5177│    │   localhost:3001│    │   localhost:5432│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN           │    │   Load Balancer│    │   Database      │
│   Static Assets │◄──►│   App Server    │◄──►│   PostgreSQL    │
│   (Vercel)      │    │   (Railway)     │    │   (Railway)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Environment Configuration
```env
# Development
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/monkpoint_dev
JWT_SECRET=dev-secret-key
PORT=3001

# Production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-host:5432/monkpoint_prod
JWT_SECRET=super-secure-production-key
PORT=3001
```

## 📈 Performance Considerations

### Frontend Optimization
- **Code Splitting** - Lazy loading of components
- **Image Optimization** - Optimized images and icons
- **Bundle Size** - Tree shaking and minification
- **Caching** - Browser caching for static assets

### Backend Optimization
- **Database Indexing** - Proper database indexes
- **Query Optimization** - Efficient Prisma queries
- **Connection Pooling** - Database connection management
- **Caching** - Redis caching for frequently accessed data

### Database Optimization
- **Indexes** - Strategic database indexes
- **Query Optimization** - Efficient SQL queries
- **Connection Management** - Connection pooling
- **Data Archiving** - Old data archiving strategy

## 🔄 Monitoring & Logging

### Application Monitoring
- **Error Tracking** - Comprehensive error logging
- **Performance Monitoring** - Response time tracking
- **User Analytics** - Usage pattern analysis
- **Database Monitoring** - Query performance tracking

### Logging Strategy
- **Structured Logging** - JSON formatted logs
- **Log Levels** - Error, warn, info, debug
- **Log Aggregation** - Centralized log collection
- **Log Retention** - Appropriate log retention periods

---

**MonkPoint Architecture** - Built with mindfulness and spiritual growth in mind 🧘‍♂️✨
