@echo off
title Docker Microservices Build & Launcher
echo ========================================================
echo   Building JAR files locally for all Java microservices...
echo ========================================================
echo.

echo Packaging Auth Service...
cd auth-service && call mvn clean package -DskipTests && cd ..
if %ERRORLEVEL% neq 0 goto error

echo Packaging Movie Service...
cd movie-service && call mvn clean package -DskipTests && cd ..
if %ERRORLEVEL% neq 0 goto error

echo Packaging Booking Service...
cd booking-service && call mvn clean package -DskipTests && cd ..
if %ERRORLEVEL% neq 0 goto error

echo Packaging Notification Service...
cd notification-service && call mvn clean package -DskipTests && cd ..
if %ERRORLEVEL% neq 0 goto error

echo Packaging Payment Service...
cd payment-service && call mvn clean package -DskipTests && cd ..
if %ERRORLEVEL% neq 0 goto error

echo Packaging API Gateway...
cd api-gateway && call mvn clean package -DskipTests && cd ..
if %ERRORLEVEL% neq 0 goto error

echo ========================================================
echo   All JARs compiled successfully! Starting Docker Compose...
echo ========================================================
docker-compose up --build -d

echo.
echo ========================================================
echo   Docker microservices launched successfully!
echo   Open Frontend: http://localhost:3000
echo ========================================================
pause
exit

:error
echo.
echo ========================================================
echo   Error occurred during local Maven packaging!
echo ========================================================
pause
