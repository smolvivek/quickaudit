# QuickAudit Expo App - Deployment Guide

This guide provides step-by-step instructions for deploying the QuickAudit Expo app to both iOS and Android platforms.

## Prerequisites

- Node.js 16.x or newer
- Expo CLI (`npm install -g expo-cli`)
- For iOS: macOS with Xcode 14 or newer
- For Android: Android Studio with SDK tools

## Setup and Testing

### 1. Initial Setup

The setup script has already been run, which:
- Created necessary directories
- Updated package.json with build scripts
- Created eas.json for EAS Build
- Created .xcode.env for iOS
- Installed dependencies

### 2. Testing with Expo Go

The quickest way to test the app is using Expo Go:

```bash
cd /Users/vivekmangipudi/Desktop/QuickAudit/app/QuickAuditExpo
npx expo start
```

Then scan the QR code with the Expo Go app on your iOS or Android device.

## iOS Deployment

### 1. Simulator Testing

To run the app on an iOS simulator:

```bash
cd /Users/vivekmangipudi/Desktop/QuickAudit/app/QuickAuditExpo
npx expo run:ios
```

If you encounter CocoaPods Unicode normalization issues, try:

```bash
cd ios
pod install --repo-update
cd ..
npx expo run:ios
```

### 2. Building for TestFlight/App Store

For production builds, use EAS Build:

```bash
npx eas build --platform ios
```

This will create a build that can be submitted to TestFlight or the App Store.

## Android Deployment

### 1. Emulator Testing

To run the app on an Android emulator:

```bash
cd /Users/vivekmangipudi/Desktop/QuickAudit/app/QuickAuditExpo
npx expo run:android
```

### 2. Building APK for Testing

To build a debug APK for testing:

```bash
cd android
./gradlew assembleDebug
```

The APK will be available at `android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Building for Google Play

For production builds, use EAS Build:

```bash
npx eas build --platform android
```

## Troubleshooting

### iOS Build Issues

1. **CocoaPods Unicode normalization issue**:
   - Ensure Ruby and CocoaPods are up to date
   - Try using a different Ruby version with rbenv or rvm
   - Run `pod repo update` before `pod install`

2. **Xcode build errors**:
   - Clear derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`
   - Update Xcode command line tools: `xcode-select --install`

### Android Build Issues

1. **Flipper-related errors**:
   - Disable Flipper in `android/app/build.gradle`
   - Update Flipper dependencies to compatible versions

2. **SDK version issues**:
   - Ensure Android SDK platforms match the targetSdkVersion in build.gradle
   - Install missing SDK components through Android Studio SDK Manager

## Final Checklist

Before submitting to app stores:

- [ ] Test app functionality on multiple devices
- [ ] Verify all screens render correctly
- [ ] Check navigation flows and transitions
- [ ] Test offline functionality
- [ ] Verify app icon and splash screen display correctly
- [ ] Test deep linking (if applicable)
- [ ] Prepare app store assets (screenshots, descriptions)
- [ ] Update privacy policy and terms of service

## App Store Assets

All required assets have been prepared:
- App icons (1024x1024 for iOS, 512x512 for Android)
- Splash screen
- Screenshots for various device sizes
- App description and keywords
- Privacy policy

## Support

For additional assistance, refer to:
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
