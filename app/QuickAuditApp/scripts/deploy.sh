#!/bin/bash
# Final deployment script for QuickAudit app

echo "Preparing QuickAudit app for final deployment..."

# Run TypeScript check
echo "Running TypeScript check..."
npx tsc --noEmit

# Build iOS app
echo "Building iOS app..."
cd ios
pod install
cd ..

# Build Android app
echo "Building Android app..."
cd android
./gradlew bundleRelease
cd ..

echo "QuickAudit app is now ready for deployment!"
echo "iOS: Open Xcode and archive the app for submission to the App Store."
echo "Android: The AAB file is located at android/app/build/outputs/bundle/release/app-release.aab"
