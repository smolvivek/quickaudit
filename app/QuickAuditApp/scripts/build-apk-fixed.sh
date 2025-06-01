#!/bin/bash
# Script to build Android APK for QuickAudit app

echo "Building QuickAudit Android APK..."

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Create assets directory if it doesn't exist
mkdir -p android/app/src/main/assets

# Bundle the JavaScript
echo "Bundling JavaScript..."
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Remove duplicate resources to avoid build conflicts
echo "Removing duplicate resources..."
rm -rf android/app/src/main/res/drawable-mdpi
rm -rf android/app/src/main/res/drawable-hdpi
rm -rf android/app/src/main/res/drawable-xhdpi
rm -rf android/app/src/main/res/drawable-xxhdpi
rm -rf android/app/src/main/res/drawable-xxxhdpi
rm -rf android/app/src/main/res/raw

# Build the debug APK
echo "Building debug APK..."
cd android
./gradlew assembleDebug --stacktrace
cd ..

# Check if the APK was built successfully
APK_PATH="android/app/build/outputs/apk/debug/app-debug.apk"
if [ -f "$APK_PATH" ]; then
  echo "APK built successfully at: $APK_PATH"
  
  # Copy the APK to the project root for easy access
  cp "$APK_PATH" "QuickAuditApp-debug.apk"
  echo "APK copied to: QuickAuditApp-debug.apk"
  
  echo "Build completed successfully!"
else
  echo "Error: APK build failed!"
  exit 1
fi