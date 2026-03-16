@echo off
echo.
echo  ♻️  AI Waste Segregation Helper — Backend Startup
echo  =====================================================
echo.

cd /d "%~dp0backend"

:: Check if virtual environment exists
if not exist "venv" (
    echo [1/3] Creating Python virtual environment...
    python -m venv venv
    echo ✅ Virtual environment created.
) else (
    echo [1/3] Virtual environment already exists.
)

:: Activate and install dependencies
echo [2/3] Installing dependencies...
call venv\Scripts\activate.bat
pip install -r requirements.txt -q

:: Copy .env if not exists
if not exist ".env" (
    copy ".env.example" ".env" >nul
    echo [INFO] Created .env from .env.example — configure your AWS keys there.
)

:: Start the server
echo [3/3] Starting Flask server on http://localhost:5000
echo.
echo  📌 To use real AWS Rekognition:
echo     1. Edit backend\.env
echo     2. Add your AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
echo     3. Set USE_DEMO_MODE=false
echo     4. Restart this server
echo.
echo  Press Ctrl+C to stop the server.
echo.

python app.py

pause
