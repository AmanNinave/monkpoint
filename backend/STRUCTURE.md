# Backend Project Structure

This document explains the organized structure of the backend API.

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic controllers
│   └── authController.js # Authentication logic
├── middleware/           # Custom middleware
│   └── auth.js          # JWT authentication middleware
├── routes/              # Route definitions
│   ├── index.js         # General routes (health check)
│   └── auth.js          # Authentication routes
├── prisma/              # Database schema and migrations
│   └── schema.prisma    # Prisma schema
├── src/                 # Generated Prisma client
│   └── generated/       # Auto-generated Prisma files
├── index.js             # Main server file
├── package.json         # Dependencies and scripts
├── .env                 # Environment variables
└── README.md            # Project documentation
```

## 🏗️ Architecture Overview

### **Controllers** (`/controllers/`)
Contains the business logic for each feature:
- **authController.js**: Handles user registration, login, profile management

### **Middleware** (`/middleware/`)
Custom middleware functions:
- **auth.js**: JWT token verification middleware

### **Routes** (`/routes/`)
Route definitions that connect URLs to controllers:
- **index.js**: General routes (health check, etc.)
- **auth.js**: Authentication routes (register, login, profile)

### **Main Server** (`index.js`)
- Sets up Express app
- Configures middleware
- Connects routes
- Handles errors

## 🔄 Request Flow

1. **Request** → Express Router
2. **Route** → Middleware (if needed)
3. **Middleware** → Controller
4. **Controller** → Business Logic
5. **Response** ← Controller

## 📋 Available Routes

### General Routes (`/api/`)
- `GET /api/health` - Health check

### Authentication Routes (`/api/auth/`)
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `POST /api/auth/logout` - Logout (protected)

## 🛠️ Adding New Features

### 1. Create a new controller:
```javascript
// controllers/userController.js
const getUsers = (req, res) => {
  // Business logic here
};

module.exports = { getUsers };
```

### 2. Create middleware (if needed):
```javascript
// middleware/validation.js
const validateInput = (req, res, next) => {
  // Validation logic here
  next();
};

module.exports = { validateInput };
```

### 3. Create routes:
```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/userController');
const { validateInput } = require('../middleware/validation');

router.get('/', validateInput, getUsers);

module.exports = router;
```

### 4. Add routes to main server:
```javascript
// index.js
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
```

## 🔧 Benefits of This Structure

- **Separation of Concerns**: Each file has a single responsibility
- **Scalability**: Easy to add new features without cluttering
- **Maintainability**: Clear organization makes code easier to understand
- **Reusability**: Controllers and middleware can be reused
- **Testing**: Each component can be tested independently

## 🚀 Development Workflow

1. **Add new feature**: Create controller → middleware (if needed) → routes
2. **Test locally**: Use `npm run dev` for auto-restart
3. **Test endpoints**: Use curl or Postman
4. **Deploy**: Use `npm start` for production
