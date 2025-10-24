#!/usr/bin/env node

/**
 * Environment Setup Script for MonkPoint Backend
 * This script helps you set up the required environment variables
 */

import { createRequire } from 'module';
import { writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);
const path = require('path');

console.log('🧘 MonkPoint Backend Environment Setup\n');

// Check if .env file exists
const envPath = join(process.cwd(), '.env');
const envExists = existsSync(envPath);

if (envExists) {
  console.log('✅ .env file already exists');
  console.log('📝 Please add the following variables to your .env file:\n');
} else {
  console.log('📝 Creating .env file...');
}

// Environment variables template
const envTemplate = `# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/hackthon_db?schema=public"

# JWT Configuration
JWT_SECRET="your_jwt_secret_here"
JWT_EXPIRES_IN="7d"

# OpenAI Configuration
OPENAI_API_KEY="your_openai_api_key_here"

# Environment
NODE_ENV="development"
PORT=3001
`;

if (!envExists) {
  try {
    writeFileSync(envPath, envTemplate);
    console.log('✅ .env file created successfully');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

console.log('\n📋 Required Environment Variables:');
console.log('=====================================');
console.log('1. DATABASE_URL - Your PostgreSQL connection string');
console.log('2. JWT_SECRET - Secret key for JWT tokens (generate a secure random string)');
console.log('3. JWT_EXPIRES_IN - Token expiration time (default: "7d")');
console.log('4. OPENAI_API_KEY - Your OpenAI API key (get from https://platform.openai.com/)');
console.log('5. NODE_ENV - Environment mode ("development" or "production")');
console.log('6. PORT - Server port (default: 3001)');

console.log('\n🔑 Getting OpenAI API Key:');
console.log('========================');
console.log('1. Visit https://platform.openai.com/');
console.log('2. Sign up or log in');
console.log('3. Go to "API Keys" section');
console.log('4. Click "Create new secret key"');
console.log('5. Copy the key (starts with "sk-")');
console.log('6. Add it to your .env file');

console.log('\n🔒 Security Reminders:');
console.log('=====================');
console.log('• Never commit .env files to version control');
console.log('• Use strong, unique secrets for JWT_SECRET');
console.log('• Keep your OpenAI API key secure');
console.log('• Use different keys for development and production');

console.log('\n🚀 Next Steps:');
console.log('==============');
console.log('1. Update the values in your .env file');
console.log('2. Run: npm run dev');
console.log('3. Test the AI integration');

console.log('\n✨ Your mindful backend is ready! 🧘‍♂️');
