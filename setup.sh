#!/bin/bash

# AccountingPro PWA Quick Setup Script
# Automates the initial setup process

echo ""
echo "🚀 AccountingPro PWA - Quick Setup"
echo "================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null
then
    echo "❌ Node.js not found. Please install Node.js 14+"
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

echo "✅ Dependencies installed"
echo ""

# Create icons directory
echo "📁 Creating icons directory..."
mkdir -p public/icons
echo "✅ Icons directory ready"
echo ""

echo "⚠️  Next steps:"
echo ""
echo "1. Generate app icons (8 sizes required):"
echo "   👉 Read ICON_GENERATION.md for detailed instructions"
echo "   Quick option: Use https://favicon.io/favicon-generator/"
echo ""
echo "2. Place icons in public/icons/"
echo "   Required sizes: 72, 96, 128, 144, 152, 192, 384, 512"
echo ""
echo "3. Start development server:"
echo "   npm start"
echo ""
echo "4. Build for production:"
echo "   npm run build"
echo ""
echo "5. Deploy to HTTPS server (required for PWA)"
echo ""
