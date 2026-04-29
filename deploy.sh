#!/bin/bash

# AccountingPro PWA - Quick Deploy Script
# This script builds and prepares for deployment

echo "📦 Building AccountingPro PWA..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "📥 Installing dependencies..."
  npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build successful!"
  echo ""
  echo "📁 Build output: ./build"
  echo ""
  echo "🚀 Deployment options:"
  echo ""
  echo "   1. Netlify: Drag & drop 'build' folder to https://app.netlify.com"
  echo "   2. Vercel:  vercel --prod"
  echo "   3. GitHub:  Use GitHub Pages from 'build' folder"
  echo "   4. Local:   npm install -g serve && serve -s build"
  echo ""
  echo "📋 Checklist before deploy:"
  echo "   ☐ Icons added to public/icons/ (8 sizes)"
  echo "   ☐ manifest.json configured"
  echo "   ☐ service-worker.js in place"
  echo "   ☐ HTTPS enabled on hosting"
  echo ""
else
  echo ""
  echo "❌ Build failed. Check errors above."
  exit 1
fi
