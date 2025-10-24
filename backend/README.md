# Backend API Server

A simple Node.js backend server with Express and JWT authentication.

## Features

- 🔐 JWT Authentication (Register, Login, Profile)
- 🛡️ Security middleware (Helmet, CORS)
- 📝 Request logging with Morgan
- 🔒 Password hashing with bcrypt
- ✅ Input validation
- 🚀 Production-ready setup

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

Create a `.env` file with your configuration:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackthon_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV="development"
```

### 3. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Health Check
- **GET** `/api/health`
- **Response**: `{ "status": "OK", "message": "Server is running", "timestamp": "..." }`

### Authentication Routes

#### Register
- **POST** `/api/auth/register`
- **Body**: `{ "email": "user@example.com", "password": "password123", "name": "John Doe" }`
- **Response**: `{ "message": "User created successfully", "user": {...}, "token": "..." }`

#### Login
- **POST** `/api/auth/login`
- **Body**: `{ "email": "user@example.com", "password": "password123" }`
- **Response**: `{ "message": "Login successful", "user": {...}, "token": "..." }`

#### Get Profile (Protected)
- **GET** `/api/auth/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ "user": {...} }`

## Testing the API

### Register a new user:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'
```

### Login:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get profile (use token from login):
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/api/auth/profile
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Security headers with Helmet
- CORS configuration
- Input validation

## Development

The server runs on port 3001 by default. Make sure to:

1. Configure environment variables
2. Start the development server with `npm run dev`
3. Test the endpoints using the examples above

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Use a process manager like PM2
4. Set up proper logging and monitoring

## Error Handling

The API includes comprehensive error handling for:
- Authentication errors
- Validation errors
- Server errors

All errors return appropriate HTTP status codes and error messages.
