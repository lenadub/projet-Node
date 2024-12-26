@echo off

REM Configuration
SET DEFAULT_PSQL="C:\Program Files\PostgreSQL\17\bin\psql.exe"
SET DEFAULT_BACKEND_DIR=%CD%
SET DB_NAME=demo
SET DB_USER=demo
SET DB_PASSWORD=demo
SET CURRENTDIR=%CD%
SET LOGFILE=%CURRENTDIR%\create_database.log

if exist "%LOGFILE%" (
    del "%LOGFILE%"
)

REM Display prompt and get user input
:prompt
echo !!! THIS SCRIPT WILL DELETE THE DATABASE PRIOR TO RUNNING THE BACKEND !!!
choice /m "Do you want to proceed (Y/N) - type ENTER to retry if you typed a different choice : " /c YN /n

REM Check user's choice
if %errorlevel%==1 (
    echo    You chose Yes. Proceeding...
) else (
    echo    You chose No. Exiting...
    exit /b 0
)

REM ==== BACKEND DIRECTORY ====
REM Prompt the user for the backend directory
SET  BACKEND_DIR=
SET  /p BACKEND_DIR="Enter the backend directory path (default: %DEFAULT_BACKEND_DIR%): "

REM Check if the input is empty
if "%BACKEND_DIR%"=="" (
    SET BACKEND_DIR=%DEFAULT_BACKEND_DIR%
    echo     No input provided. Using default value: %DEFAULT_BACKEND_DIR%
)

REM Check if the directory exists
if not exist "%BACKEND_DIR%\" (
    echo Error: The directory "%BACKEND_DIR%" does not exist.
    exit /b 1
)

REM ==== NPM DEPEDENCIS  ====
REM Go to backend directory
cd %BACKEND_DIR%

REM Install npm dependencies
echo Installing npm dependencies...
call npm install >> %LOGFILE% 2>>&1
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot install npm dependencies.
    goto handle_error
)

REM ==== PSQL COMMAND ====
REM Prompt the user for the PSQL command
SET PSQL=
SET /p PSQL="Enter the PSQL command path (default: %DEFAULT_PSQL%):  "

REM Check if the input is empty : use default
if "%PSQL%"=="" (
    SET PSQL=%DEFAULT_PSQL%
    echo     No input provided. Using default value: %DEFAULT_PSQL%
 )

 REM Check if the command exists
 if not exist %PSQL% (
     echo Error: invalid path for PSQL command  : %PSQL%
     exit /b 1
 )


REM ==== PSQL PASSWORD ====
REM Ask for PostgreSQL password
set /p PGPASSWORD="Enter password for PostgreSQL 'postgres': "


REM ==== PSQL CNX ====
REM Check PostgreSQL connection
echo Checking PostgreSQL connection...
%PSQL% -U postgres -c "SELECT version();" >> %LOGFILE% 2>>&1
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot connect to PostgreSQL. Ensure it is running and the password is correct.
    goto handle_error
)

echo    Connection successful!


REM ==== DB INIT ====
REM Drop database if it exists
echo Dropping database if it exists...
%PSQL% -U postgres -c "DROP DATABASE IF EXISTS %DB_NAME%;" >> %LOGFILE% 2>>&1
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot drop database.
    goto handle_error
)

REM Drop user if it exists
echo Dropping user if it exists...
%PSQL% -U postgres -c "DROP ROLE IF EXISTS %DB_USER%;" >> %LOGFILE% 2>>&1
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot drop user.
    goto handle_error
)

REM Create database user
echo Creating database user...
%PSQL% -U postgres -c "CREATE USER %DB_USER% WITH PASSWORD '%DB_PASSWORD%';" >> %LOGFILE% 2>>&1
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot create user.
    goto handle_error
)

REM Create database
echo Creating database...
%PSQL% -U postgres -c "CREATE DATABASE %DB_NAME% OWNER %DB_USER%;" >> %LOGFILE% 2>>&1 
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot create database.
    goto handle_error
)


REM Load DB schema
echo Loading database schema...
call tsx data/schema.ts >> %LOGFILE% 2>>&1
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot load database schema.
    goto handle_error
)

REM Seed the database
echo Seeding database...
call tsx data/seed.ts 
IF %ERRORLEVEL% NEQ 0 (
    SET ERROR_MSG=Cannot seed database.
    goto handle_error
)


REM ==== RUN BACKEND ====
REM Display prompt and get user input
choice /m "Do you want to start backend? - type ENTER to retry if you typed a different choice :" /c YN /n

REM Check user's choice
if %errorlevel%==2 (
    echo You chose not to proceed. Exiting...
    exit /b 0
)

REM Run backend application
echo Starting backend application...
call tsx index.ts 
IF %ERRORLEVEL% NEQ 0 (
   SET ERROR_MSG=Cannot start backend.
   goto handle_error
)

REM Return to the initial directory
cd %CURRENTDIR%
echo Script completed successfully!
exit /b 0


REM ==== ERROR HANDLING ====
REM Function to handle errors
:handle_error
echo Error: %ERROR_MSG%  - check log file %LOGFILE% 
cd %CURRENTDIR%
exit /b 1

REM Process Break
:handle_INTERRUPT
echo Error: Interrupt
exit /b 1

