@echo off
echo 🚇 Setting up Transport Web System...
echo ====================================

REM Check if we're in the right directory
if not exist "backend" (
    echo [ERROR] Please run this script from the transport-web directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo [ERROR] Please run this script from the transport-web directory
    pause
    exit /b 1
)

echo [INFO] Setting up backend dependencies...

REM Setup backend
cd backend

REM Download dependencies
echo [INFO] Downloading C++ HTTP library...
where curl >nul 2>nul
if %errorlevel% == 0 (
    curl -L https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h -o httplib.h
    echo [SUCCESS] Downloaded httplib.h
) else (
    echo [WARNING] curl not found. Please download httplib.h manually from:
    echo https://raw.githubusercontent.com/yhirose/cpp-httplib/master/httplib.h
)

echo [INFO] Downloading JSON library...
where curl >nul 2>nul
if %errorlevel% == 0 (
    curl -L https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp -o json.hpp
    echo [SUCCESS] Downloaded json.hpp
) else (
    echo [WARNING] curl not found. Please download json.hpp manually from:
    echo https://raw.githubusercontent.com/nlohmann/json/develop/single_include/nlohmann/json.hpp
)

REM Try to compile
echo [INFO] Attempting to compile backend...
where g++ >nul 2>nul
if %errorlevel% == 0 (
    g++ -std=c++17 enhanced_server.cpp -o enhanced_demo.exe
    if %errorlevel% == 0 (
        echo [SUCCESS] Backend demo compiled successfully!
    ) else (
        echo [WARNING] Compilation failed. You may need to adjust include paths.
    )
) else (
    echo [WARNING] g++ not found. Please install MinGW or Visual Studio.
)

cd ..

REM Setup frontend
echo [INFO] Setting up frontend dependencies...
cd frontend

where npm >nul 2>nul
if %errorlevel% == 0 (
    echo [INFO] Installing Node.js dependencies...
    npm install
    if %errorlevel% == 0 (
        echo [SUCCESS] Frontend dependencies installed!
    ) else (
        echo [ERROR] Failed to install frontend dependencies
    )
) else (
    echo [WARNING] npm not found. Please install Node.js and npm.
    echo You can download Node.js from: https://nodejs.org/
)

cd ..

REM Create run scripts
echo [INFO] Creating run scripts...

REM Backend run script
echo @echo off > run-backend.bat
echo echo 🚇 Starting Transport API Server... >> run-backend.bat
echo cd backend >> run-backend.bat
echo if exist "transport-api.exe" ( >> run-backend.bat
echo     transport-api.exe >> run-backend.bat
echo ^) else ( >> run-backend.bat
echo     echo Backend not compiled. Run compilation first. >> run-backend.bat
echo     if exist "enhanced_demo.exe" ( >> run-backend.bat
echo         echo Running enhanced demo instead... >> run-backend.bat
echo         enhanced_demo.exe >> run-backend.bat
echo     ^) >> run-backend.bat
echo ^) >> run-backend.bat
echo pause >> run-backend.bat

REM Frontend run script
echo @echo off > run-frontend.bat
echo echo 🚇 Starting Transport Web Frontend... >> run-frontend.bat
echo cd frontend >> run-frontend.bat
echo if exist "node_modules" ( >> run-frontend.bat
echo     npm start >> run-frontend.bat
echo ^) else ( >> run-frontend.bat
echo     echo Frontend dependencies not installed. Run 'npm install' first. >> run-frontend.bat
echo     pause >> run-frontend.bat
echo ^) >> run-frontend.bat

echo [SUCCESS] Run scripts created!

REM Create development script
echo @echo off > dev.bat
echo echo 🚇 Starting Transport Web System in Development Mode... >> dev.bat
echo echo ====================================================== >> dev.bat
echo echo. >> dev.bat
echo echo Starting backend server... >> dev.bat
echo start "Backend" run-backend.bat >> dev.bat
echo echo. >> dev.bat
echo timeout /t 3 /nobreak ^>nul >> dev.bat
echo echo Starting frontend development server... >> dev.bat
echo start "Frontend" run-frontend.bat >> dev.bat
echo echo. >> dev.bat
echo echo 🚇 Transport Web System is starting up! >> dev.bat
echo echo Backend API: http://localhost:8080 >> dev.bat
echo echo Frontend: http://localhost:3000 >> dev.bat
echo echo. >> dev.bat
echo echo Press any key to continue... >> dev.bat
echo pause >> dev.bat

echo [SUCCESS] Development script created!

REM Final instructions
echo.
echo 🎉 Setup Complete!
echo ==================
echo.
echo To start the system:
echo   dev.bat                  # Start both backend and frontend
echo   run-backend.bat          # Start only backend API
echo   run-frontend.bat         # Start only frontend
echo.
echo Manual setup:
echo   Backend:  cd backend ^&^& g++ -std=c++17 enhanced_server.cpp -o enhanced_demo.exe ^&^& enhanced_demo.exe
echo   Frontend: cd frontend ^&^& npm start
echo.
echo Access the application at: http://localhost:3000
echo API documentation at: http://localhost:8080/api/status
echo.

if not exist "backend\httplib.h" (
    echo [WARNING] httplib.h may be missing. Check the backend directory.
)

if not exist "backend\json.hpp" (
    echo [WARNING] json.hpp may be missing. Check the backend directory.
)

if not exist "frontend\node_modules" (
    echo [WARNING] Frontend dependencies not installed. Run 'npm install' in frontend directory.
)

echo [SUCCESS] Ready to launch your transport network! 🚇
pause