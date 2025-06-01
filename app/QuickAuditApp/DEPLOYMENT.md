# QuickAudit App Deployment Guide

This guide provides instructions for deploying the QuickAudit mobile app to both iOS and Android platforms.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Xcode (for iOS deployment)
- Android Studio (for Android deployment)
- Apple Developer account (for iOS App Store deployment)
- Google Play Developer account (for Android Play Store deployment)

## Quick Deployment (For Demo/Testing)

### 1. Run on iOS Simulator

```bash
# Install dependencies
npm install

# Start the Metro bundler
npm run start

# In a new terminal, run on iOS simulator
npm run ios
```

### 2. Run on Android Emulator

```bash
# Install dependencies
npm install

# Start the Metro bundler
npm run start

# In a new terminal, run on Android emulator
npm run android
```

### 3. Run on Physical Device

#### iOS:
1. Open the iOS project in Xcode:
   ```bash
   cd ios
   pod install
   open QuickAuditApp.xcworkspace
   ```
2. Select your device from the device dropdown
3. Click the Run button

#### Android:
1. Connect your device via USB
2. Enable USB debugging on your device
3. Run:
   ```bash
   npm run android
   ```

## Production Deployment

### iOS App Store Deployment

1. **Prepare your app**:
   ```bash
   cd ios
   pod install
   ```

2. **Open in Xcode**:
   ```bash
   open QuickAuditApp.xcworkspace
   ```

3. **Configure app signing**:
   - Select the project in the Project Navigator
   - Select the QuickAuditApp target
   - Go to the "Signing & Capabilities" tab
   - Select your team and provisioning profile

4. **Set up app metadata**:
   - Update the Bundle Identifier
   - Set the Version and Build numbers
   - Configure App Icons and Launch Screen

5. **Archive the app**:
   - Select "Generic iOS Device" as the build target
   - Select Product > Archive
   - Once archiving is complete, the Organizer window will appear

6. **Upload to App Store Connect**:
   - Click "Distribute App"
   - Select "App Store Connect"
   - Follow the prompts to upload

### Android Play Store Deployment

1. **Generate a signed APK/AAB**:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. **Configure app signing**:
   - Create a keystore file if you don't have one:
     ```bash
     keytool -genkey -v -keystore quickaudit.keystore -alias quickaudit -keyalg RSA -keysize 2048 -validity 10000
     ```
   - Configure signing in `android/app/build.gradle`

3. **Build the release version**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   
4. **Test the release build**:
   ```bash
   npx react-native run-android --variant=release
   ```

5. **Upload to Google Play Console**:
   - Log in to the Google Play Console
   - Create a new app or select your existing app
   - Navigate to "Production" > "Create new release"
   - Upload your AAB file
   - Fill in the release details and submit for review

## Troubleshooting

### Common Issues

1. **Build fails with dependency errors**:
   ```bash
   # Clear npm cache
   npm cache clean --force
   
   # Delete node_modules and reinstall
   rm -rf node_modules
   npm install
   ```

2. **iOS build fails with CocoaPods errors**:
   ```bash
   cd ios
   pod deintegrate
   pod setup
   pod install
   ```

3. **Android build fails with Gradle errors**:
   ```bash
   cd android
   ./gradlew clean
   ```

4. **Metro bundler issues**:
   ```bash
   # Reset Metro cache
   npm start -- --reset-cache
   ```

## Quick Demo Setup

If you need to quickly demonstrate the app without a full deployment:

1. **Start the Metro bundler**:
   ```bash
   npm run start
   ```

2. **Use Expo Go app**:
   - Install Expo Go on your device
   - Scan the QR code displayed in the terminal

3. **Use the landing page**:
   - Open `landing-page.html` in a browser to showcase the app features
   - Use the screenshots in the `screenshots` directory for visual demonstration

## Deployment Checklist

- [ ] All TypeScript errors are fixed
- [ ] App icons and splash screens are configured
- [ ] App version and build numbers are updated
- [ ] All API endpoints are pointing to production servers
- [ ] Analytics and crash reporting are configured
- [ ] App passes all tests
- [ ] Privacy policy and terms of service are updated
- [ ] App Store and Play Store listings are prepared

## Contact

For deployment assistance, contact the development team at support@quickaudit.com
