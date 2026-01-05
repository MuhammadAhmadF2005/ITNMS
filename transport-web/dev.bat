@echo off
echo 🚇 Starting Transport Web System in Development Mode...
echo ======================================================
echo.
echo Starting backend server...
start "Backend" cmd /k "cd backend && enhanced_demo.exe"
echo.
timeout /t 3 /nobreak >nul
echo Starting frontend development server...
start "Frontend" cmd /k "cd frontend && npm start"
echo.
echo 🚇 Transport Web System is starting up!
echo Backend API: http://localhost:8080
echo Frontend: http://localhost:3000
echo.
echo Press any key to continue...
pause