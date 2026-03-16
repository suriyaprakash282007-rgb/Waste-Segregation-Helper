@echo off
echo.
echo  ♻️  WasteSense AI — Next.js App Startup
echo  ==========================================
echo.

cd /d "%~dp0nextjs-app"

:: Copy .env if not exists
if not exist ".env.local" (
    copy ".env.example" ".env.local" >nul
    echo [INFO] Created .env.local — add your AWS keys there to enable real AI.
)

:: Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed!
    echo.
    echo  Please download and install Node.js from: https://nodejs.org/
    echo  Recommended version: Node.js 18 LTS or higher
    echo.
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

:: Install dependencies if node_modules missing
if not exist "node_modules" (
    echo [1/2] Installing dependencies ^(this may take 1-2 minutes^)...
    npm install
    echo.
) else (
    echo [1/2] Dependencies already installed.
)

echo [2/2] Starting Next.js development server...
echo.
echo  ✅ App will be available at: http://localhost:3000
echo  📌 AWS credentials: edit nextjs-app\.env.local
echo  📌 Press Ctrl+C to stop.
echo.

npm run dev

pause
