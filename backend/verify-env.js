#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * This script checks if all required environment variables are set
 */

import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧘 MonkPoint Backend Environment Verification\n');

// Required environment variables
const requiredVars = [
  'DATABASE_URL',
  'JWT_SECRET', 
  'JWT_EXPIRES_IN',
  'OPENAI_API_KEY',
  'NODE_ENV',
  'PORT'
];

let allSet = true;

console.log('📋 Environment Variables Status:');
console.log('================================');

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const isSet = value && value !== 'your_jwt_secret_here' && value !== 'your_openai_api_key_here';
  
  if (isSet) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Not set or using default value`);
    allSet = false;
  }
});

console.log('\n🔍 Detailed Status:');
console.log('==================');

// Check specific variables
const databaseUrl = process.env.DATABASE_URL;
if (databaseUrl && databaseUrl.includes('postgresql://')) {
  console.log('✅ DATABASE_URL: Valid PostgreSQL connection string');
} else {
  console.log('❌ DATABASE_URL: Invalid or missing');
  allSet = false;
}

const jwtSecret = process.env.JWT_SECRET;
if (jwtSecret && jwtSecret.length > 10 && jwtSecret !== 'your_jwt_secret_here') {
  console.log('✅ JWT_SECRET: Set and secure');
} else {
  console.log('❌ JWT_SECRET: Not set or using default value');
  allSet = false;
}

const openaiKey = process.env.OPENAI_API_KEY;
if (openaiKey && openaiKey.startsWith('sk-') && openaiKey !== 'your_openai_api_key_here') {
  console.log('✅ OPENAI_API_KEY: Valid OpenAI API key');
} else {
  console.log('❌ OPENAI_API_KEY: Not set or invalid format');
  allSet = false;
}

const nodeEnv = process.env.NODE_ENV;
console.log(`📊 NODE_ENV: ${nodeEnv || 'Not set'}`);

const port = process.env.PORT;
console.log(`🌐 PORT: ${port || 'Not set'}`);

console.log('\n🎯 Summary:');
console.log('===========');

if (allSet) {
  console.log('✅ All environment variables are properly configured!');
  console.log('🚀 Your backend is ready to run with AI integration.');
} else {
  console.log('❌ Some environment variables are missing or invalid.');
  console.log('📝 Please update your .env file with the correct values.');
  console.log('🔧 Run: node setup-env.js for setup instructions.');
}

console.log('\n🧘‍♂️ Namaste! Your mindful backend awaits. ✨');
