# 📱 Android Build & Testing Guide

**ToDoTask Mobile App - Android APK Build**

---

## 🚀 Quick Start - Three Options

### Option 1: Expo Go (Fastest - for testing)
```bash
# No build needed! Use Expo Go app on your Android phone
cd mobile
npm install
npm start

# When prompted, press 'a' to open Android emulator
# Or scan QR code with Expo Go app on your physical device
```

**Time**: 2-3 minutes ⚡  
**Setup**: Just Expo Go app + phone/emulator  
**Perfect for**: Quick testing, dev changes

---

### Option 2: APK Build (Local)
```bash
# Build standalone APK locally
cd mobile
npm install
npx eas build --platform android --local

# Generated APK: dist/todotask-mobile-*.apk
# Transfer to Android device and install
```

**Time**: 30-60 minutes  
**Requirements**: Android SDK, Java 17+  
**Perfect for**: Full app experience

---

### Option 3: APK Build (Cloud - Recommended)
```bash
# Build on EAS (Expo build servers)
cd mobile
npm install
npx eas build --platform android

# Download generated APK from Expo dashboard
# Share via email, cloud drive, or QR code
```

**Time**: 10-15 minutes  
**Requirements**: Expo account (free)  
**Perfect for**: Sharing, consistent builds, no local SDK needed

---

## 📋 Prerequisites

### For Option 1 (Expo Go):
```bash
✅ Node.js 18+
✅ npm or yarn
✅ Expo Go app on Android phone (free from Google Play)
```

### For Option 2 (Local APK):
```bash
✅ Node.js 18+
✅ Android SDK (API 34+)
✅ Android NDK
✅ JAVA_HOME environment variable set
✅ 50GB+ disk space
```

Check your setup:
```bash
# Windows
echo %JAVA_HOME%
echo %ANDROID_HOME%

# macOS/Linux
echo $JAVA_HOME
echo $ANDROID_HOME
```

### For Option 3 (Cloud APK - Recommended):
```bash
✅ Node.js 18+
✅ Expo account (register free at expo.dev)
✅ Internet connection
```

---

## 🔧 Installation Steps

### Step 1: Install Expo CLI
```bash
npm install -g eas-cli
npm install -g expo-cli
```

### Step 2: Create Expo Account (if using Option 3)
```bash
eas login
# Follow prompts to create free account or sign in
```

### Step 3: Configure App
```bash
cd mobile

# Update app.json for your build
# Set: name, slug, android.package, android.versionCode
```

---

## 🔨 Building Steps

### Option 1: Expo Go (Instant Testing)
```bash
cd mobile
npm install
npm start

# Terminal output shows:
# To run the app with live reloading, choose one of:
# • Scan the QR code above with Expo Go - it will open your app
# › Press 'a' › open Android
# › Press 'i' › open iOS simulator
# › Press 'w' › open web

# Press 'a' or scan QR with Expo Go app
```

**Result**: App runs on your phone instantly! 📲

---

### Option 2: Local APK Build

```bash
# 1. Navigate to project
cd mobile

# 2. Configure EAS
eas build:configure

# 3. Build for Android
eas build --platform android --local

# 4. Monitor build
# Shows build status, download link when ready

# 5. Download APK
# From: dist/ folder or Expo dashboard
```

**Check build status**:
```bash
eas build:list
```

**Cancel build** (if needed):
```bash
eas build:cancel <BUILD_ID>
```

---

### Option 3: Cloud Build (Recommended)

```bash
# 1. Login to Expo
eas login

# 2. Configure app
cd mobile
eas build:configure

# 3. Trigger cloud build
eas build --platform android

# Output will show:
# ✓ Build submitted to EAS
# ✓ Build ID: abc123...
# ✓ Check status: eas build:list

# 4. Monitor progress
eas build:list

# 5. Download when ready
# Via: Expo dashboard or terminal link
```

---

## 📥 Installing on Android Device

### Via APK File
```bash
# 1. Download APK to computer
# Location: dist/todotask-mobile-*.apk

# 2. Transfer to phone
# Option A: Email, Google Drive, etc.
# Option B: USB cable
adb push dist/todotask-mobile-*.apk /sdcard/Download/

# 3. Install on phone
# Option A: Open file manager → tap APK → Install
# Option B: Via ADB
adb install dist/todotask-mobile-*.apk

# 4. Launch app
# Tap "ToDoTask Mobile" icon on home screen
```

### Via Expo Go
```bash
# 1. Install Expo Go
# Google Play Store → search "Expo Go"

# 2. On your computer (terminal)
npm start
# Shows QR code

# 3. On phone
# Open Expo Go
# Tap "Scan QR code"
# Point camera at terminal QR code

# 4. App launches instantly!
```

---

## 🧪 Testing the App

### Scenario 1: Basic Flow
```
1. Open app
2. Tap "Sign up"
3. Enter:
   - Username: testuser
   - Email: test@example.com
   - Password: TestPass123
   - Confirm: TestPass123
4. Tap "Sign Up"
5. ✅ Should redirect to todo list
```

### Scenario 2: Create Todo
```
1. Tap "+ Create New Task"
2. Enter title: "Test Todo"
3. Enter description: "Testing offline sync"
4. Set priority: HIGH
5. Tap "Create"
6. ✅ Todo appears in list
```

### Scenario 3: Offline Sync
```
1. Create a todo
2. Enable Airplane Mode
3. Edit the todo (change title)
4. Offline indicator should show
5. Disable Airplane Mode
6. Watch status bar: "Synced 2m ago"
7. ✅ Changes synced to backend
```

### Scenario 4: Todo Operations
```
1. Tap todo → Edit screen opens
2. Change status to "IN_PROGRESS"
3. Change priority to "URGENT"
4. Tap "Save"
5. Return to list
6. Tap todo again → changes persisted
7. Tap "Complete" button
8. Todo marked as COMPLETED
9. ✅ All operations working
```

---

## 📦 Build Configuration

### app.json
```json
{
  "expo": {
    "name": "ToDoTask Mobile",
    "slug": "todotask-mobile",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.todotask.mobile",
      "versionCode": 1
    },
    "ios": {
      "supportsTabletMode": true,
      "bundleIdentifier": "com.todotask.mobile"
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

---

## 🔗 Backend Configuration

### .env for Android
```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:8080/api
EXPO_PUBLIC_SYNC_INTERVAL=300000
EXPO_PUBLIC_MAX_RETRIES=3
EXPO_PUBLIC_RETRY_DELAY=1000
```

**Note**: `10.0.2.2` is the special address to reach host machine from Android emulator.

### For Physical Device
```bash
EXPO_PUBLIC_API_URL=http://<YOUR_IP>:8080/api
# Replace <YOUR_IP> with your computer's IP (ifconfig/ipconfig)
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache
rm -rf node_modules
npm install

# Clear Expo cache
expo prebuild --clean
```

### App Won't Connect to Backend
```bash
# Check backend is running
curl http://localhost:8080/api/todos

# Check IP address (on physical device)
ipconfig getifaddr en0  # macOS
ipconfig             # Windows

# Update .env with correct IP
```

### "Port already in use"
```bash
# Kill process on port 8080
# macOS/Linux:
lsof -i :8080
kill -9 <PID>

# Windows:
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### APK Installation Fails
```bash
# Try clearing app cache first
adb shell pm clear com.todotask.mobile

# Then install
adb install -r dist/todotask-mobile-*.apk
```

---

## 📊 Build Output

### Successful Build
```
✓ Build submitted
✓ Build ID: abc123def456
✓ Platform: Android
✓ Status: building
✓ Check status: eas build:list
✓ When ready: eas build:download abc123def456
```

### Download APK
```bash
# Option 1: From terminal
eas build:download <BUILD_ID> --path ./app.apk

# Option 2: From Expo dashboard
# https://expo.dev → Builds → Download

# Option 3: From QR code
# Builds → Show QR → Scan with phone
```

---

## 📱 Device Requirements

### Minimum (Android 9+)
- Android 9 (API 28) or higher
- 100MB free space
- Internet connection

### Recommended
- Android 12+ (API 31+)
- 500MB free space
- WiFi connection (faster sync)

---

## 🔐 Security Notes

- ✅ User data stored locally on device
- ✅ Network requests encrypted with HTTPS
- ✅ Auth tokens stored in secure storage
- ✅ No sensitive data in logs
- ⚠️ For production: enable ProGuard/R8 obfuscation

---

## 📤 Sharing APK

### Method 1: Email
```bash
# Attach APK file to email
# File: dist/todotask-mobile-*.apk
# Size: ~50-80 MB
```

### Method 2: Cloud Drive
```bash
# Upload to Google Drive, Dropbox, OneDrive
# Share download link with testers
```

### Method 3: QR Code
```bash
# Use Expo dashboard QR code
# Testers scan with phone → instant install
```

### Method 4: App Distribution Service
```bash
# For wider testing:
# - TestFlight (iOS)
# - Internal Testing (Google Play)
# - Firebase App Distribution
```

---

## ✅ Testing Checklist

Before sharing, verify:

- [ ] Backend running on correct port
- [ ] Frontend dependencies installed
- [ ] APK built successfully
- [ ] App installs on test device
- [ ] Login/Signup working
- [ ] Can create todos
- [ ] Can edit todos
- [ ] Can delete todos
- [ ] Offline mode works
- [ ] Sync works when online
- [ ] No console errors
- [ ] Performance acceptable

---

## 📞 Quick Links

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction
- **Android Dev Guide**: https://developer.android.com

---

## 🎉 You're Ready!

Choose your build method above and follow the steps. Your Android app will be ready for testing in minutes!

**Questions?** Check the troubleshooting section or refer to Expo documentation.

Happy testing! 🚀
