@echo off
cd /d "%~dp0"

echo.
echo ╔══════════════════════════════════════╗
echo ║   Tyske Preposisjoner — Starter...   ║
echo ╚══════════════════════════════════════╝
echo.

:: Kill any process already using port 8080
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":8080 " 2^>nul') do (
  taskkill /PID %%a /F >nul 2>&1
)

echo → Åpner http://localhost:8080
echo   Trykk Ctrl+C for å stoppe serveren.
echo.

:: Try python first, then py (Python Launcher for Windows)
where python >nul 2>&1
if %errorlevel%==0 (
  start /b python -m http.server 8080
  goto :open
)
where py >nul 2>&1
if %errorlevel%==0 (
  start /b py -m http.server 8080
  goto :open
)

echo FEIL: Python ble ikke funnet.
echo Last ned Python fra https://www.python.org/downloads/
echo og huk av "Add Python to PATH" under installasjonen.
pause
exit /b 1

:open
timeout /t 2 /nobreak >nul
start http://localhost:8080
pause
