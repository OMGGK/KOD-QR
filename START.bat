@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo BLAD: Zainstaluj Node.js LTS z https://nodejs.org/
  pause
  exit /b 1
)
if not exist "node_modules" (
  echo Instalowanie bibliotek - wymagany internet przy pierwszym uruchomieniu...
  call npm install
  if errorlevel 1 (echo Nie udalo sie zainstalowac bibliotek.& pause & exit /b 1)
)
echo Otwieram panel lokalny...
start "" "http://localhost:5173"
call npm run dev
pause
