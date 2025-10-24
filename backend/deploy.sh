#!/bin/bash

# MonkPoint Backend - Vercel Deployment Script
# This script helps deploy the backend to Vercel

echo "🧘 MonkPoint Backend - Vercel Deployment"
echo "======================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI is not installed. Installing now..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    echo "🔐 Please login to Vercel first:"
    vercel login
fi

echo "📦 Installing dependencies..."
npm install

echo "🔧 Generating Prisma client..."
npx prisma generate

echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Vercel dashboard"
echo "2. Run database migrations: curl -X POST https://your-app.vercel.app/api/migrate"
echo "3. Test your deployment: curl https://your-app.vercel.app/api/health"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
