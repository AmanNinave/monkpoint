#!/bin/bash

echo "🚀 Deploying backend with root route fix..."

# Navigate to backend directory
cd /Users/amanninave/Desktop/Developement/Projects/hackthon/backend

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🔗 Your backend should now be available at:"
echo "   - Root route: https://monkpoint-api.vercel.app/"
echo "   - Health check: https://monkpoint-api.vercel.app/api/health"
echo "   - Calendar API: https://monkpoint-api.vercel.app/api/calendar"
