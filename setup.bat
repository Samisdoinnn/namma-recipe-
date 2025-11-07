@echo off
REM Recipe App Setup Script for Windows
REM This script helps you get started with the Recipe App

echo.
echo 🍳 Welcome to Recipe App Setup!
echo =================================
echo.

REM Check Node.js installation
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Visit: https://nodejs.org/
    exit /b 1
)

echo ✅ Node.js version:
node --version

REM Check npm installation
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ npm version:
npm --version
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% EQU 0 (
    echo ✅ Dependencies installed successfully!
) else (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo.

REM Check if .env exists
if not exist .env (
    echo ⚠️  .env file not found. Creating from example...
    copy .env.example .env >nul
    echo ✅ Created .env file
    echo.
    echo ⚠️  IMPORTANT: Please update .env with your Firebase credentials!
    echo    Edit .env and add your Firebase configuration
    echo.
) else (
    echo ✅ .env file exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env with your Firebase credentials
echo 2. Create a Firebase project at https://console.firebase.google.com/
echo 3. Enable Authentication (Email/Password^)
echo 4. Create Firestore Database
echo 5. Run: npm start
echo.
echo For detailed instructions, see:
echo - QUICKSTART.md - Fast setup guide
echo - README.md - Complete documentation
echo - DEPLOYMENT.md - Deployment guide
echo.
echo Ready to start? Run: npm start
echo.

pause
