@echo off
title Microservices Launcher
echo ========================================================
echo   Starting Booking System Microservices & Frontend
echo ========================================================
echo.

echo Starting Auth Service on port 8081...
start "Auth Service (8081)" cmd /k "cd /d %~dp0auth-service && mvnw spring-boot:run"

echo Starting Movie Service on port 8082...
start "Movie Service (8082)" cmd /k "cd /d %~dp0movie-service && mvnw spring-boot:run"

echo Starting Booking Service on port 8083...
start "Booking Service (8083)" cmd /k "cd /d %~dp0booking-service && mvnw spring-boot:run"

echo Starting Notification Service on port 8084...
start "Notification Service (8084)" cmd /k "cd /d %~dp0notification-service && mvnw spring-boot:run"

echo Starting Payment Service on port 8085...
start "Payment Service (8085)" cmd /k "cd /d %~dp0payment-service && mvnw spring-boot:run"

echo Waiting 15 seconds for microservices to start...
timeout /t 15 /nobreak > nul

echo Starting API Gateway on port 8080...
start "API Gateway (8080)" cmd /k "cd /d %~dp0api-gateway && mvnw spring-boot:run"

echo Starting Frontend...
start "Frontend (React)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================================
echo   All 7 Services Launched Successfully!
echo   * IMPORTANT: Please wait for all cmd windows to show 
echo     "Started ...Application in X seconds" before refreshing.
echo   Open Frontend: http://localhost:3000
echo ========================================================
pause


