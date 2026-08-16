@echo off
title OmniSight Industrial Web Platform Launcher
echo =========================================================================
echo   OMNISIGHT: AI-Driven Predictive Maintenance & AR Digital Twin System
echo   PSG Polytechnic College, Coimbatore - 641 004 (Course C24653)
echo =========================================================================
echo.

cd /d "%~dp0"
if exist "omnisight web" cd "omnisight web"

:: Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not detected on this system.
    echo Please install Node.js from https://nodejs.org/ to run this project.
    echo.
    pause
    exit /b
)

:: If node_modules is missing on another PC, install automatically
if not exist "node_modules\" (
    echo [SETUP] Initializing project dependencies for the first time...
    echo Please wait a moment...
    call npm install
    echo [SETUP] Dependencies installed successfully!
    echo.
)

echo [OK] Launching OmniSight Web Platform...
echo Local URL: http://localhost:5173/
echo.

timeout /t 2 /nobreak >nul
start http://localhost:5173/

call npm run dev
pause
