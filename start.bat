@echo off
echo Starting DataBridge AI...

start cmd /k "python main.py"
echo Backend starting on http://localhost:8000

cd frontend
start cmd /k "npm run dev"
echo Frontend starting on http://localhost:3000

echo.
echo Once both servers are up:
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/api
