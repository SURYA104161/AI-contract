@echo off
cd /d "%~dp0backend"
echo Setting up AI Contract Explainer Backend...
echo.
echo Make sure you have set your GROQ_API_KEY in backend\.env
echo Get a free key at: https://console.groq.com/keys
echo.
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
pause
