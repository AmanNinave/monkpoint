#!/bin/bash

# Deploy fix for OpenAI Agents framework Zod schema issue
echo "🧘 Deploying MonkPoint AI Agent fix..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Please install it first:"
    echo "npm install -g vercel"
    exit 1
fi

# Check if logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "❌ Not logged in to Vercel. Please login first:"
    echo "vercel login"
    exit 1
fi

echo "✅ Environment checks passed"

# Deploy to production
echo "🚀 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🧘 MonkPoint AI Agent is now live with the fix!"
    
    # Test the deployment
    echo "🔍 Testing AI initialization..."
    sleep 5  # Wait a moment for deployment to be ready
    
    # Get the deployment URL (you might need to update this)
    echo "📡 Please test your AI endpoints manually:"
    echo "curl -X POST https://your-backend.vercel.app/api/ai/initialize"
else
    echo "❌ Deployment failed. Please check the logs above."
    exit 1
fi

echo "✨ Namaste! Your mindful AI companion is ready to serve. 🧘‍♂️"
