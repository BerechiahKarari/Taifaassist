@echo off
echo Starting TaifaAssist...
echo.
echo Starting Backend Server...
start cmd /k "npm run server"
timeout /t 2 /nobreak >nul
echo.
echo Starting Frontend Development Server...
start cmd /k "npm run dev"
echo.
echo TaifaAssist is starting!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
