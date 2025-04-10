@echo off
echo Initializing sample data...
cd backend
call venv\Scripts\activate
python init_data.py
pause 