@echo off
cd /d "%~dp0backend"
echo Starting AI Contract Explainer Backend...
echo.
echo Make sure you have set all env vars in backend\.env
echo Get a Groq key at: https://console.groq.com/keys
echo.
uvicorn app:app --host 0.0.0.0 --port 8000 --reload
pause
