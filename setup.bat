@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: Farm Store Management Dashboard - Setup & Start Script
:: Automatically detects first run vs subsequent runs

echo.
echo ==============================================
echo    Farm Store Management Dashboard
echo ==============================================
echo.

:: Step 1: Environment Check
echo [Step 1] Checking environment...
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

:: Check if this is first run (no .env file)
if exist ".env" (
    echo.
    echo [INFO] Configuration found. Skipping setup...
    goto :start_server
)

:: First run - need to configure
echo.
echo ==============================================
echo    First Run - Database Configuration
echo ==============================================
echo.
echo Note: Press ENTER to use default value shown in [brackets]
echo       Items marked with * are REQUIRED
echo.

set /p DB_HOST="  MySQL Host [localhost] (press ENTER for default): "
if "!DB_HOST!"=="" set DB_HOST=localhost

set /p DB_USER="  MySQL Username [root] (press ENTER for default): "
if "!DB_USER!"=="" set DB_USER=root

echo.
echo   * MySQL Password is REQUIRED - please enter your password:
set /p DB_PASSWORD="  MySQL Password: "
if "!DB_PASSWORD!"=="" (
    echo.
    echo [ERROR] Password cannot be empty!
    pause
    exit /b 1
)

echo.
set /p DB_NAME="  Database Name [farm_store_db] (press ENTER for default): "
if "!DB_NAME!"=="" set DB_NAME=farm_store_db

:: Create .env file
echo.
echo [Step 2] Creating .env file...

(
echo DB_HOST=!DB_HOST!
echo DB_USER=!DB_USER!
echo DB_PASSWORD=!DB_PASSWORD!
echo DB_NAME=!DB_NAME!
) > .env

echo .env file created successfully!

:: Initialize database
echo.
echo [Step 3] Initializing database...
echo.

if not "!DB_NAME!"=="farm_store_db" (
    powershell -Command "(Get-Content database_setup.sql) -replace 'farm_store_db', '!DB_NAME!' | Set-Content database_setup_temp.sql"
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

:start_server
:: Install dependencies if needed
if not exist "node_modules\" (
    echo.
    echo [Step 4] Installing dependencies...
    call npm install
)

echo.
echo ==============================================
echo    Starting Server
echo ==============================================
echo.
echo Server will start at: http://localhost:3000
echo Press Ctrl+C to stop the server.
echo.

:: Try to open browser
start "" http://localhost:3000 2>nul
if %errorlevel% neq 0 (
    echo [INFO] Could not open browser automatically.
    echo        Please open http://localhost:3000 manually.
    echo.
)

call npm start
