/**
 * Script to fix Flipper-related issues in the Android build
 */

const fs = require('fs');
const path = require('path');

// Fix the ReactNativeFlipper.java file
const fixReactNativeFlipper = () => {
  const flipperPath = path.join(process.cwd(), 'android/app/src/debug/java/com/quickauditapp/ReactNativeFlipper.java');
  const flipperDir = path.dirname(flipperPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(flipperDir)) {
    fs.mkdirSync(flipperDir, { recursive: true });
    console.log('Created ReactNativeFlipper directory');
  }
  
  // Create a simplified version of ReactNativeFlipper.java
  const content = `package com.quickauditapp;

import android.content.Context;
import com.facebook.react.ReactInstanceManager;

/**
 * Class responsible for loading Flipper in React Native applications.
 * This is a simplified version that doesn't require Flipper dependencies.
 */
public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    // No-op implementation to avoid Flipper dependencies
    // This is only used in debug builds
  }
}`;
  
  fs.writeFileSync(flipperPath, content, 'utf8');
  console.log('Created simplified ReactNativeFlipper.java');
};

// Fix the app build.gradle file to remove Flipper dependencies
const fixAppBuildGradle = () => {
  const buildGradlePath = path.join(process.cwd(), 'android/app/build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Remove Flipper dependencies
    content = content.replace(/debugImplementation\("com.facebook.flipper:flipper:[^"]*"\)[\r\n\s]*/g, '');
    content = content.replace(/debugImplementation\("com.facebook.flipper:flipper-network-plugin:[^"]*"\)[\r\n\s]*/g, '');
    content = content.replace(/debugImplementation\("com.facebook.flipper:flipper-fresco-plugin:[^"]*"\)[\r\n\s]*/g, '');
    
    // Remove FLIPPER_VERSION variable reference if it exists
    content = content.replace(/\$\{FLIPPER_VERSION\}/g, '');
    
    fs.writeFileSync(buildGradlePath, content, 'utf8');
    console.log('Removed Flipper dependencies from build.gradle');
  } else {
    console.error('build.gradle not found');
  }
};

// Create a modified build script for generating APK
const createModifiedBuildScript = () => {
  const content = `#!/bin/bash
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
fi`;

  const scriptPath = path.join(process.cwd(), 'scripts/build-apk-fixed.sh');
  fs.writeFileSync(scriptPath, content, 'utf8');
  fs.chmodSync(scriptPath, '755');
  console.log('Created build-apk-fixed.sh script');
};

// Run all functions
console.log('Fixing Flipper-related issues...');
fixReactNativeFlipper();
fixAppBuildGradle();
createModifiedBuildScript();
console.log('Flipper-related issues fixed successfully!');
console.log('Run `cd android && ./gradlew clean` before trying to build again.');
console.log('To build the APK, run: ./scripts/build-apk-fixed.sh');
