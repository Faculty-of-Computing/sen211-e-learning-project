@echo off

:: Check if Python is installed
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Python is not installed. Installing Python...
    powershell -Command "Invoke-WebRequest -Uri https://www.python.org/ftp/python/3.11.5/python-3.11.5-amd64.exe -OutFile python-installer.exe"
    powershell -Command "Start-Process -Wait -FilePath python-installer.exe -ArgumentList '/quiet InstallAllUsers=1 PrependPath=1'"
    del python-installer.exe
) else (
    echo Python is already installed.
)

:: Prepare Virtual Environment
echo Preparing Virtual Environment...
if not exist venv\Scripts\activate (
    python -m venv venv
)

echo Activating Virtual Environment...
call venv\Scripts\activate

:: Ensure pip is up-to-date
python -m pip install --upgrade pip

:: Install necessary Python packages
echo Installing required Python packages...
pip install playwright

:: Install Playwright browsers (Windows-compatible)
echo Installing Playwright browsers...
python -m playwright install


:: Notify user of completion
if %ERRORLEVEL% EQU 0 (
    echo Build completed successfully. Running script.
    python sen_test.py
) else (
    echo Build failed. Check the error messages above.
)

pause