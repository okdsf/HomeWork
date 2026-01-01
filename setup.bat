@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: Farm Store Management Dashboard - One-Click Setup Script
:: Supports: Windows

echo.
echo ==============================================
echo    Farm Store Management Dashboard Setup
echo ==============================================
echo.

:: Step 1: Environment Check
echo [Step 1/5] Checking environment...
echo.

set MISSING=0

where node >nul 2>nul
if %errorlevel%==0 (
    echo [OK] node is installed
) else (
    echo [MISSING] node is not installed
    set MISSING=1
)

where npm >nul 2>nul
if %errorlevel%==0 (
    echo [OK] npm is installed
) else (
    echo [MISSING] npm is not installed
    set MISSING=1
)

:: Check for mysql in PATH or common install locations
set MYSQL_CMD=mysql
where mysql >nul 2>nul
if %errorlevel%==0 (
    echo [OK] mysql is installed ^(in PATH^)
) else (
    :: Check common MySQL installation paths
    if exist "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" (
        set "MYSQL_CMD=C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
        echo [OK] mysql found at MySQL Server 8.0
    ) else if exist "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe" (
        set "MYSQL_CMD=C:\Program Files\MySQL\MySQL Server 8.4\bin\mysql.exe"
        echo [OK] mysql found at MySQL Server 8.4
    ) else if exist "C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe" (
        set "MYSQL_CMD=C:\Program Files\MySQL\MySQL Server 5.7\bin\mysql.exe"
        echo [OK] mysql found at MySQL Server 5.7
    ) else if exist "C:\xampp\mysql\bin\mysql.exe" (
        set "MYSQL_CMD=C:\xampp\mysql\bin\mysql.exe"
        echo [OK] mysql found at XAMPP
    ) else if exist "C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe" (
        set "MYSQL_CMD=C:\wamp64\bin\mysql\mysql8.0.31\bin\mysql.exe"
        echo [OK] mysql found at WAMP
    ) else (
        echo [MISSING] mysql is not installed
        set MISSING=1
    )
)

if %MISSING%==1 (
    echo.
    echo Please install the missing dependencies first.
    pause
    exit /b 1
)

echo.
echo Environment check passed!

:: Step 2: Get database configuration from user
echo.
echo [Step 2/5] Database Configuration
echo.

set /p DB_HOST="MySQL Host [localhost]: "
if "!DB_HOST!"=="" set DB_HOST=localhost

set /p DB_USER="MySQL Username [root]: "
if "!DB_USER!"=="" set DB_USER=root

set /p DB_PASSWORD="MySQL Password: "

set /p DB_NAME="Database Name [farm_store]: "
if "!DB_NAME!"=="" set DB_NAME=farm_store

:: Step 3: Create .env file
echo.
echo [Step 3/5] Creating .env file...
echo.

(
echo DB_HOST=!DB_HOST!
echo DB_USER=!DB_USER!
echo DB_PASSWORD=!DB_PASSWORD!
echo DB_NAME=!DB_NAME!
) > .env

echo .env file created successfully!

:: Step 4: Initialize database
echo.
echo [Step 4/5] Initializing database...
echo.

:: Create a temporary SQL file with correct database name
if not "!DB_NAME!"=="farm_store" (
    powershell -Command "(Get-Content database_setup.sql) -replace 'farm_store', '!DB_NAME!' | Set-Content database_setup_temp.sql"
    "!MYSQL_CMD!" -h "!DB_HOST!" -u "!DB_USER!" -p"!DB_PASSWORD!" < database_setup_temp.sql
    del database_setup_temp.sql
) else (
    "!MYSQL_CMD!" -h "!DB_HOST!" -u "!DB_USER!" -p"!DB_PASSWORD!" < database_setup.sql
)

if %errorlevel%==0 (
    echo Database initialized successfully!
) else (
    echo Database initialization failed!
    pause
    exit /b 1
)

:: Step 5: Install dependencies and start server
echo.
echo [Step 5/5] Installing dependencies ^& starting server...
echo.

call npm install

echo.
echo ==============================================
echo    Setup Complete!
echo ==============================================
echo.
echo Starting server... The browser will open automatically.
echo Press Ctrl+C to stop the server.
echo.

:: Open browser after a short delay
start "" cmd /c "timeout /t 3 /nobreak >nul && start "" "%~dp0public\index.html""

call npm start
