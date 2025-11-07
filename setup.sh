#!/bin/bash

# Recipe App Setup Script
# This script helps you get started with the Recipe App

set -e

echo "🍳 Welcome to Recipe App Setup!"
echo "================================="
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check npm installation
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from example..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Please update .env with your Firebase credentials!"
    echo "   Edit .env and add your Firebase configuration"
    echo ""
else
    echo "✅ .env file exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env with your Firebase credentials"
echo "2. Create a Firebase project at https://console.firebase.google.com/"
echo "3. Enable Authentication (Email/Password)"
echo "4. Create Firestore Database"
echo "5. Run: npm start"
echo ""
echo "For detailed instructions, see:"
echo "- QUICKSTART.md - Fast setup guide"
echo "- README.md - Complete documentation"
echo "- DEPLOYMENT.md - Deployment guide"
echo ""
echo "Ready to start? Run: npm start"
echo ""
