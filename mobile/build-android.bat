@echo off
REM Quick Android APK Build Script for ToDoTask Mobile - Windows Version

setlocal enabledelayedexpansion

echo.
echo 🚀 ToDoTask Mobile - Android APK Builder
echo ===========================================
echo.

REM Check prerequisites
echo ✓ Checking prerequisites...

where node >nul 2>nul
if errorlevel 1 (
    echo ❌ Node.js not found. Install from https://nodejs.org
    exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
    echo ❌ npm not found
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i

echo ✓ Node.js version: %NODE_VER%
echo ✓ npm version: %NPM_VER%
echo.

REM Navigate to mobile directory
cd /d "%~dp0"

echo 📁 Current directory: %CD%
echo.

REM Option selection
echo Choose build method:
echo 1. Expo Go (instant, no APK needed) - RECOMMENDED FOR FIRST TEST
echo 2. Local APK build
echo 3. Cloud APK build (EAS)
echo.
set /p BUILD_OPTION="Select option (1-3): "

if "%BUILD_OPTION%"=="1" (
    echo.
    echo 🎯 Starting Expo Go - Instant Testing
    echo ====================================
    echo.
    echo Installing dependencies...
    call npm install
    
    echo.
    echo ✓ Starting dev server...
    echo.
    echo 🔗 Your app will launch when you:
    echo    Option A: Press 'a' ^(Android emulator^)
    echo    Option B: Press 'i' ^(iOS simulator^)
    echo    Option C: Scan QR code with Expo Go app on your phone
    echo.
    
    call npm start
    
) else if "%BUILD_OPTION%"=="2" (
    echo.
    echo 📦 Building Local Android APK
    echo ================================
    echo.
    
    REM Check for required tools
    if "!JAVA_HOME!"=="" (
        echo ⚠️  JAVA_HOME not set
        echo    Set it: set JAVA_HOME=C:\Program Files\Java\jdk-17
        exit /b 1
    )
    
    if "!ANDROID_HOME!"=="" (
        echo ⚠️  ANDROID_HOME not set
        echo    Set it: set ANDROID_HOME=C:\Users\%%USERNAME%%\AppData\Local\Android\Sdk
        exit /b 1
    )
    
    echo ✓ JAVA_HOME: !JAVA_HOME!
    echo ✓ ANDROID_HOME: !ANDROID_HOME!
    echo.
    
    echo Installing dependencies...
    call npm install
    
    echo.
    echo Configuring EAS...
    call npx eas build:configure
    
    echo.
    echo ⏳ Building APK locally ^(this may take 5-10 minutes^)...
    echo.
    
    call npx eas build --platform android --local
    
    echo.
    echo ✅ APK built successfully!
    echo 📁 Location: dist\todotask-mobile-*.apk
    echo.
    echo 📱 To install:
    echo    adb install dist\todotask-mobile-*.apk
    
) else if "%BUILD_OPTION%"=="3" (
    echo.
    echo ☁️  Building Android APK on Expo Cloud
    echo ========================================
    echo.
    
    echo Logging in to Expo...
    call npx eas login
    
    echo.
    echo Installing dependencies...
    call npm install
    
    echo.
    echo Configuring EAS...
    call npx eas build:configure
    
    echo.
    echo ⏳ Submitting build to Expo ^(takes 3-5 minutes^)...
    echo.
    
    call npx eas build --platform android
    
    echo.
    echo ✅ Build submitted!
    echo.
    echo 📊 Check build status:
    echo    eas build:list
    echo.
    echo 📥 Download APK:
    echo    eas build:download ^<BUILD_ID^>
    echo.
    echo 🔗 Or download from: https://expo.dev
    
) else (
    echo Invalid option
    exit /b 1
)

echo.
echo ✅ Done!
