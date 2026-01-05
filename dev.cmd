@echo off
TITLE YT-Genius Dev Server
COLOR 0B

echo 🚀 Starting YT-Genius "VidIQ Killer" Development Environment...

:: 1. Start FastAPI Backend in a new window
echo 🛠️ Launching Python Backend (FastAPI)...
start cmd /k "python -m uvicorn api.index:app --reload --port 8000"

:: 2. Start React Frontend in the current window
echo 🎨 Launching React Frontend (Vite)...
npm run dev

pause