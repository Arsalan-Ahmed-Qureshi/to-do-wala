# 🚀 Android Testing - Quick Start (3 Minutes)

## 🎯 Choose Your Path

### **Option A: Instant Testing (1 minute setup)**
For testing on your phone RIGHT NOW without waiting for builds:

```bash
# 1. Install Expo Go app from Google Play
#    Search: "Expo Go" 

# 2. In terminal:
cd mobile
npm install
npm start

# 3. Scan QR code with Expo Go app
# 4. App loads instantly! 📱
```

**Time**: ~2 minutes  
**Best for**: Quick testing, dev changes  
**Share**: Just tell testers to install Expo Go + scan QR

---

### **Option B: Shareable APK (5 minute build)**
For sharing a standalone APK file to testers:

```bash
# 1. Windows:
cd mobile
build-android.bat

# 2. macOS/Linux:
cd mobile
bash build-android.sh

# 3. Choose option 1, 2, or 3
# 4. Wait for build
# 5. Share generated APK file
```

**Time**: 5-15 minutes  
**Best for**: Sharing with others, offline testing  
**Share**: Send the APK file via email/cloud drive

---

### **Option C: Cloud Build (Recommended)**
Fastest build, works everywhere:

```bash
# 1. Create free Expo account at expo.dev
# 2. In terminal:
cd mobile
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android

# 3. Download APK when ready
# 4. Share APK or QR code
```

**Time**: 5-10 minutes (cloud build)  
**Best for**: Professional builds, CI/CD  
**Share**: Download APK + share

---

## ✅ Fastest Path (Start Now!)

```bash
# Step 1: Get Expo Go on your phone
# Google Play → Search "Expo Go" → Install

# Step 2: Start dev server
cd d:\AQ\project_place\TODO-Project-Expriments\mobile
npm install
npm start

# Step 3: See QR code in terminal
# Step 4: Open Expo Go app → Tap "Scan QR code"
# Step 5: Point phone camera at terminal
# Step 6: App launches! 🎉
```

**You'll see:**
- ✅ Login/Signup screen
- ✅ Create todos
- ✅ Edit todos  
- ✅ See sync indicator
- ✅ Try offline mode

---

## 📱 Testing Checklist

Once app loads, test these:

- [ ] Sign up new account
- [ ] Create a todo
- [ ] Edit the todo
- [ ] Mark as complete
- [ ] Delete a todo
- [ ] Go airplane mode (offline)
- [ ] Create todo offline
- [ ] Turn off airplane mode
- [ ] See "Synced" message
- [ ] Refresh browser to see todo on server

---

## 🔗 Backend Ready?

Make sure backend is running:
```bash
cd backend
java -jar target/todotask-api-1.0.0.jar
# Should show: Tomcat started on port 8080
```

Check: http://localhost:8080/api/todos (should respond with error or data)

---

## 📤 Sharing with Others

### **Option 1: Expo Go (Easiest)**
1. Tell them: "Install Expo Go app"
2. Start `npm start` from mobile directory
3. Share QR code or terminal link
4. They scan → app loads instantly ✨

### **Option 2: APK File**
1. Build APK (see below)
2. Download file: `todotask-mobile-*.apk`
3. Email/upload to cloud drive
4. Tester: Email → Open with phone → Install

### **Option 3: QR Code Link**
1. Use Expo dashboard QR code
2. Tester scans → downloads + installs
3. App appears on their home screen

---

## 🏗️ Build Commands (Quick Reference)

```bash
# Windows - Interactive menu:
build-android.bat

# macOS/Linux - Interactive menu:
bash build-android.sh

# Or manual:
cd mobile

# Install deps
npm install

# Start Expo Go
npm start

# Build APK locally (requires Android SDK)
eas build --platform android --local

# Build APK in cloud (requires Expo account)
eas build --platform android
```

---

## 📊 Expected Output

### Expo Go (npm start):
```
 expo v3.0.0 ready in 842 ms

  ➜  Local:   http://localhost:19000
  ➜  Network: exp://123.456.789.012:19000/
  
  › Metro waiting on exp://192.168.1.5:19000
  
  Scan this QR code:
  [QR CODE DISPLAYED HERE]
  
  ► Press 'a' to open Android emulator
  ► Press 'i' to open iOS simulator
  ► Press 's' to sign in with Expo
  ► Press 'w' to open web preview
```

### APK Build Success:
```
✓ Build submitted
✓ Build ID: abc123def456
✓ Platform: android
✓ Wait for build to complete...
✓ Check status: eas build:list

✅ When ready:
   eas build:download abc123def456
```

---

## 🆘 Troubleshooting

**App won't start:**
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start
```

**Backend not connecting:**
```bash
# Check backend running
curl http://localhost:8080/api/todos

# Update IP in .env if needed
```

**Port in use:**
```bash
# Windows: 
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8080
kill -9 <PID>
```

**Build fails:**
```bash
eas build:cancel <BUILD_ID>
npm install
npm start  # Try Expo Go first
```

---

## 🎯 Next Steps

**Right Now (2 minutes):**
1. ✅ Go to mobile directory
2. ✅ Run: `npm install && npm start`
3. ✅ Press 'a' for Android emulator OR scan QR with Expo Go
4. ✅ Test the app

**When Ready to Share (5-15 minutes):**
1. Build APK using script above
2. Download generated file
3. Share via email/cloud/QR code

**For Production (Optional):**
1. Create Expo account
2. Use cloud builds
3. Distribute via TestFlight/Google Play

---

## 📞 Resources

- **Expo Docs**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **This Project**: See PHASE2_SUMMARY.md for full architecture

---

## ✨ You're Ready!

**Start here:**
```bash
cd mobile
npm start
```

Then choose your testing method above. 🚀

Questions? Check ANDROID_BUILD_GUIDE.md for detailed instructions!
