#!/bin/bash
# Quick Android APK Build Script for ToDoTask Mobile

set -e

echo "🚀 ToDoTask Mobile - Android APK Builder"
echo "==========================================="
echo ""

# Check prerequisites
echo "✓ Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Install from https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"
echo ""

# Navigate to mobile directory
cd "$(dirname "$0")"

echo "📁 Current directory: $(pwd)"
echo ""

# Option selection
echo "Choose build method:"
echo "1. Expo Go (instant, no APK needed) - RECOMMENDED FOR FIRST TEST"
echo "2. Local APK build"
echo "3. Cloud APK build (EAS)"
echo ""
read -p "Select option (1-3): " BUILD_OPTION

case $BUILD_OPTION in
    1)
        echo ""
        echo "🎯 Starting Expo Go - Instant Testing"
        echo "===================================="
        echo ""
        echo "Install dependencies..."
        npm install
        
        echo ""
        echo "✓ Starting dev server..."
        echo ""
        echo "🔗 Your app will launch when you:"
        echo "   Option A: Press 'a' (Android emulator)"
        echo "   Option B: Press 'i' (iOS simulator)"
        echo "   Option C: Scan QR code with Expo Go app on your phone"
        echo ""
        
        npm start
        ;;
    
    2)
        echo ""
        echo "📦 Building Local Android APK"
        echo "================================"
        echo ""
        
        # Check for required tools
        if [ -z "$JAVA_HOME" ]; then
            echo "⚠️  JAVA_HOME not set"
            echo "   Set it: export JAVA_HOME=/path/to/java"
            exit 1
        fi
        
        if [ -z "$ANDROID_HOME" ]; then
            echo "⚠️  ANDROID_HOME not set"
            echo "   Set it: export ANDROID_HOME=/path/to/android-sdk"
            exit 1
        fi
        
        echo "✓ JAVA_HOME: $JAVA_HOME"
        echo "✓ ANDROID_HOME: $ANDROID_HOME"
        echo ""
        
        echo "Installing dependencies..."
        npm install
        
        echo ""
        echo "Configuring EAS..."
        npx eas build:configure
        
        echo ""
        echo "⏳ Building APK locally (this may take 5-10 minutes)..."
        echo ""
        
        npx eas build --platform android --local
        
        echo ""
        echo "✅ APK built successfully!"
        echo "📁 Location: dist/todotask-mobile-*.apk"
        echo ""
        echo "📱 To install:"
        echo "   adb install dist/todotask-mobile-*.apk"
        ;;
    
    3)
        echo ""
        echo "☁️  Building Android APK on Expo Cloud"
        echo "========================================"
        echo ""
        
        echo "Logging in to Expo..."
        npx eas login
        
        echo ""
        echo "Installing dependencies..."
        npm install
        
        echo ""
        echo "Configuring EAS..."
        npx eas build:configure
        
        echo ""
        echo "⏳ Submitting build to Expo (takes 3-5 minutes)..."
        echo ""
        
        npx eas build --platform android
        
        echo ""
        echo "✅ Build submitted!"
        echo ""
        echo "📊 Check build status:"
        echo "   eas build:list"
        echo ""
        echo "📥 Download APK:"
        echo "   eas build:download <BUILD_ID>"
        echo ""
        echo "🔗 Or download from: https://expo.dev"
        ;;
    
    *)
        echo "Invalid option"
        exit 1
        ;;
esac

echo ""
echo "✅ Done!"
