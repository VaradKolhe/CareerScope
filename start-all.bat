@echo off
echo ===========================================
echo ================Career Scope===============
echo ===========================================

echo [1/3] Starting AI engine...
:: Opens a new window named "AI Engine" and runs the python script
start "AI Engine" cmd /k "python ai_engine/U10.py"

echo [2/3] Starting backend...
:: Opens a new window named "Backend", changes directory, and runs npm start
start "Backend" cmd /k "cd backend && npm start"

echo [3/3] Starting frontend...
:: Opens a new window named "Frontend", changes directory, and runs npm run dev
start "Frontend" cmd /k "cd frontend && npm run dev"

echo ===========================================
echo All services are launching in separate windows.
echo ===========================================
pause