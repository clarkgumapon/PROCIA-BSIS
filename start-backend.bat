@echo off
echo Starting FastAPI Backend...
cd backend
call venv\Scripts\activate
uvicorn main:app --reload 