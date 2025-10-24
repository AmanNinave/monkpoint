#!/usr/bin/env node

/**
 * Test script for the new OpenAI Agents framework
 * This script tests the basic functionality of the MonkPoint AI agent
 */

import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

console.log('🧘 Testing MonkPoint AI Agent with OpenAI Agents Framework\n');

// Check if OpenAI API key is set
if (!process.env.OPENAI_API_KEY) {
  console.error('❌ OPENAI_API_KEY environment variable is not set');
  console.log('Please set your OpenAI API key in the .env file');
  process.exit(1);
}

console.log('✅ OpenAI API key is configured');

// Create a simple test tool
const getTestDataTool = tool({
  name: 'get_test_data',
  description: 'Get test data for the user',
  parameters: z.object({
    userId: z.string().describe('The user\'s ID')
  }),
  execute: async ({ userId }) => {
    return {
      message: `Hello ${userId}! This is test data from the MonkPoint AI agent.`,
      timestamp: new Date().toISOString(),
      userId: userId
    };
  }
});

// Create a simple test agent
const testAgent = new Agent({
  name: "MonkPoint Test Agent",
  instructions: `You are a test agent for MonkPoint. You should be helpful, mindful, and supportive. 
  When asked for test data, use the get_test_data tool. Always maintain a calm and spiritual tone.`,
  tools: [getTestDataTool]
});

async function testBasicAgent() {
  try {
    console.log('🤖 Testing basic agent functionality...');
    
    const result = await run(testAgent, 'Hello! Can you get test data for user "test-user-123"?');
    
    console.log('✅ Agent response:');
    console.log(result.finalOutput);
    console.log('\n🎯 Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  }
}

async function testWithUserContext() {
  try {
    console.log('\n🧘 Testing agent with user context...');
    
    const result = await run(testAgent, 'Please provide some mindful guidance for my spiritual journey.', {
      userContext: { userId: 'test-user-123' },
      env: {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY
      }
    });
    
    console.log('✅ Agent response with context:');
    console.log(result.finalOutput);
    console.log('\n🎯 Context test completed successfully!');
    
  } catch (error) {
    console.error('❌ Context test failed:', error.message);
    console.error('Full error:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting MonkPoint AI Agent tests...\n');
  
  await testBasicAgent();
  await testWithUserContext();
  
  console.log('\n✨ All tests completed! Your MonkPoint AI agent is ready to serve. 🧘‍♂️');
}

runTests().catch(console.error);
