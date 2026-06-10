@echo off
REM Colors and setup script for Windows

echo.
echo ========================================================
echo    Black Friday Campaign - Setup ^& Start Script
echo ========================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js found: %NODE_VERSION%

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Install backend dependencies
echo.
echo Installing backend dependencies...
cd server
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo [OK] Dependencies installed successfully!

REM Create .env files if they don't exist
if not exist ".env" (
    echo.
    echo Creating frontend .env file...
    (
        echo REACT_APP_API_URL=http://localhost:5000/api
        echo REACT_APP_ENV=development
    ) > .env
    echo [OK] .env created
)

if not exist "server\.env" (
    echo.
    echo Creating backend .env file...
    (
        echo PORT=5000
        echo NODE_ENV=development
        echo REACT_APP_URL=http://localhost:3000
        echo JWT_SECRET=your-super-secret-key-change-in-production-2024
    ) > server\.env
    echo [OK] server\.env created
)

echo.
echo ========================================================
echo              Setup Complete!
echo ========================================================
echo.
echo To start the application, open two Command Prompts:
echo.
echo Command Prompt 1 (Backend):
echo   cd server
echo   npm start
echo.
echo Command Prompt 2 (Frontend):
echo   npm start
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Admin Dashboard: Click the 🔐 Admin button on landing page
echo.
pause
