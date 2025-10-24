# 🧘 MonkPoint Development Rules & Guidelines

## 📋 Table of Contents
- [Spiritual Theme Rules](#spiritual-theme-rules)
- [Code Standards](#code-standards)
- [Naming Conventions](#naming-conventions)
- [UI/UX Guidelines](#uiux-guidelines)
- [API Design Rules](#api-design-rules)
- [Database Guidelines](#database-guidelines)
- [Security Rules](#security-rules)
- [Testing Standards](#testing-standards)
- [Documentation Requirements](#documentation-requirements)

## 🧘 Spiritual Theme Rules

### ✅ DO's
- **Use Spiritual Terminology**: Always use monk/spiritual language
  - "Sacred Practices" instead of "Habits"
  - "Sacred Intentions" instead of "Goals"
  - "Inner Reflection" instead of "Moods"
  - "Journey" instead of "Dashboard"
  - "Sacred Space" instead of "Settings"

- **Include Meditation Symbol**: Use 🧘 emoji in branding and key areas
- **Warm Color Palette**: Use amber, orange, rose, emerald colors
- **Peaceful Language**: Use mindful, calming terminology
- **Spiritual Wisdom**: Include quotes from Buddha, Lao Tzu, Dalai Lama

### ❌ DON'Ts
- **Avoid Corporate Language**: No "productivity", "efficiency", "optimization"
- **No Harsh Colors**: Avoid bright blues, reds, or aggressive colors
- **No Stressful Terminology**: Avoid "deadline", "pressure", "urgent"
- **No Materialistic Focus**: Avoid "success", "achievement", "winning"

## 💻 Code Standards

### ✅ DO's
- **ES Modules**: Always use `import/export` syntax
- **Functional Components**: Use React hooks, avoid class components
- **Clean Code**: Write readable, self-documenting code
- **Error Handling**: Implement comprehensive error management
- **TypeScript Ready**: Structure code for future TypeScript migration

### ❌ DON'Ts
- **No CommonJS**: Avoid `require/module.exports`
- **No Class Components**: Use functional components with hooks
- **No Inline Styles**: Use Tailwind CSS classes
- **No Hardcoded Values**: Use environment variables and constants

## 🏷️ Naming Conventions

### Files & Directories
```
✅ CORRECT:
- components/Sidebar.jsx
- pages/Dashboard.jsx
- services/api.js
- utils/helpers.js

❌ WRONG:
- components/sidebar.jsx
- pages/dashboard.jsx
- services/Api.js
- utils/Helpers.js
```

### Variables & Functions
```javascript
✅ CORRECT:
- const userSettings = {}
- const fetchUserData = () => {}
- const isAuthenticated = true
- const API_BASE_URL = 'http://localhost:3001'

❌ WRONG:
- const user_settings = {}
- const FetchUserData = () => {}
- const is_authenticated = true
- const apiBaseUrl = 'http://localhost:3001'
```

### Components
```javascript
✅ CORRECT:
- const HabitCard = () => {}
- const MotivationQuote = () => {}
- const UserProfile = () => {}

❌ WRONG:
- const habitCard = () => {}
- const motivation_quote = () => {}
- const userProfile = () => {}
```

## 🎨 UI/UX Guidelines

### Color Usage
```css
✅ PRIMARY COLORS:
- bg-amber-600 (buttons, active states)
- text-amber-600 (headings, important text)
- border-amber-200 (subtle borders)

✅ SECONDARY COLORS:
- bg-rose-600 (mood/reflection elements)
- bg-emerald-600 (growth/progress elements)
- bg-orange-600 (warm accents)

❌ AVOID:
- bg-red-600 (too aggressive)
- bg-blue-600 (too corporate)
- bg-gray-900 (too dark for monk theme)
```

### Typography
```css
✅ HEADINGS:
- text-3xl font-bold (main headings)
- text-xl font-semibold (section headings)
- text-lg font-medium (subsection headings)

✅ BODY TEXT:
- text-gray-900 (primary text)
- text-gray-600 (secondary text)
- text-gray-500 (muted text)
```

### Spacing
```css
✅ CONSISTENT SPACING:
- p-6 (main padding)
- p-4 (card padding)
- p-2 (small padding)
- space-y-6 (vertical spacing)
- space-y-4 (medium spacing)
- space-y-2 (small spacing)
```

## 🔌 API Design Rules

### Endpoint Naming
```
✅ CORRECT:
- GET /api/habits
- POST /api/habits
- PUT /api/habits/:id
- DELETE /api/habits/:id
- POST /api/habits/:id/entries

❌ WRONG:
- GET /api/habit
- POST /api/create-habit
- PUT /api/habits/update/:id
- DELETE /api/remove-habit/:id
```

### Response Format
```javascript
✅ SUCCESS RESPONSE:
{
  "message": "Sacred practice created successfully",
  "habit": { ... },
  "token": "..." // if auth endpoint
}

✅ ERROR RESPONSE:
{
  "error": "Practice name is required",
  "status": 400
}
```

### HTTP Status Codes
```
✅ CORRECT USAGE:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error
```

## 🗄️ Database Guidelines

### Model Naming
```
✅ CORRECT:
- User (singular, PascalCase)
- Habit (singular, PascalCase)
- HabitEntry (singular, PascalCase)
- UserSettings (singular, PascalCase)

❌ WRONG:
- Users (plural)
- habits (lowercase)
- habit_entries (snake_case)
- user_settings (snake_case)
```

### Field Naming
```prisma
✅ CORRECT:
- id String @id @default(cuid())
- userId String
- createdAt DateTime @default(now())
- isActive Boolean @default(true)

❌ WRONG:
- ID String @id
- user_id String
- created_at DateTime
- is_active Boolean
```

### Relationships
```prisma
✅ CORRECT:
- user User @relation(fields: [userId], references: [id], onDelete: Cascade)
- habits Habit[]
- settings UserSettings?

❌ WRONG:
- user User @relation(fields: [user_id], references: [id])
- habits Habit[] @relation("UserHabits")
- settings UserSettings? @relation("UserSettings")
```

## 🔐 Security Rules

### Authentication
```javascript
✅ ALWAYS:
- Verify JWT tokens on protected routes
- Hash passwords with bcrypt (12+ salt rounds)
- Validate all input data
- Use HTTPS in production

❌ NEVER:
- Store plain text passwords
- Trust client-side validation only
- Expose sensitive data in responses
- Use weak JWT secrets
```

### Input Validation
```javascript
✅ CORRECT:
- Check required fields
- Validate email format
- Check password length (min 6 chars)
- Sanitize user input
- Validate data types

❌ WRONG:
- Trust client-side validation
- Allow SQL injection
- Accept malformed data
- Skip authentication checks
```

## 🧪 Testing Standards

### Test Structure
```
✅ CORRECT:
- Test happy path scenarios
- Test error conditions
- Test edge cases
- Test authentication
- Test data validation

❌ WRONG:
- Only test happy paths
- Skip error testing
- Ignore edge cases
- Test implementation details
```

### API Testing
```bash
✅ CORRECT:
- Test all CRUD operations
- Test authentication
- Test validation errors
- Test unauthorized access
- Test data integrity

❌ WRONG:
- Only test successful cases
- Skip authentication tests
- Ignore error responses
- Test UI instead of API
```

## 📚 Documentation Requirements

### Code Documentation
```javascript
✅ CORRECT:
/**
 * Creates a new sacred practice for the user
 * @param {Object} practiceData - The practice information
 * @param {string} practiceData.name - The practice name
 * @param {string} practiceData.frequency - The practice frequency
 * @returns {Promise<Object>} The created practice
 */
const createPractice = async (practiceData) => {
  // Implementation
}

❌ WRONG:
// Creates a habit
const createHabit = async (data) => {
  // Implementation
}
```

### README Requirements
```
✅ MUST INCLUDE:
- Project overview
- Installation instructions
- API documentation
- Database schema
- Development guidelines
- Deployment instructions
- Contributing guidelines

❌ AVOID:
- Outdated information
- Missing setup steps
- Unclear instructions
- No examples
```

## 🚀 Deployment Rules

### Environment Variables
```env
✅ REQUIRED:
- DATABASE_URL
- JWT_SECRET
- JWT_EXPIRES_IN
- PORT
- NODE_ENV

❌ NEVER:
- Commit .env files
- Use default secrets
- Expose sensitive data
- Skip environment validation
```

### Production Checklist
```
✅ BEFORE DEPLOYMENT:
- [ ] Environment variables set
- [ ] Database migrations applied
- [ ] SSL certificates configured
- [ ] CORS properly set
- [ ] Error logging enabled
- [ ] Performance monitoring setup
- [ ] Security headers configured
- [ ] Rate limiting implemented
```

## 🎯 Spiritual Theme Checklist

### Content Review
```
✅ VERIFY:
- [ ] All text uses spiritual terminology
- [ ] No corporate/productivity language
- [ ] Meditation emoji (🧘) included in branding
- [ ] Warm, peaceful color palette
- [ ] Mindful, calming language
- [ ] Spiritual wisdom in quotes
- [ ] Peaceful user experience
```

### Visual Review
```
✅ VERIFY:
- [ ] Amber/orange primary colors
- [ ] Rose colors for reflection
- [ ] Emerald colors for growth
- [ ] Clean, peaceful design
- [ ] No harsh or aggressive colors
- [ ] Meditation symbols included
- [ ] Warm, inviting interface
```

---

**Remember**: Every decision should align with the spiritual, peaceful nature of MonkPoint. When in doubt, choose the more mindful, peaceful option. 🧘‍♂️✨
