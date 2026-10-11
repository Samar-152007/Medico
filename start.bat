@echo off
title MEDICO AI Symptom Checker
echo ===================================================
echo           Starting MEDICO Healthcare AI
echo ===================================================
echo.

if not exist node_modules (
    echo [1/2] Installing dependencies...
    call npm.cmd install
)

echo [2/2] Launching MEDICO dev server...
echo The app will be available at http://localhost:5173
echo Press Ctrl+C to stop the server.
echo.
call npm.cmd run dev
pause
