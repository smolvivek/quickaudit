/**
 * Script to fix Android build issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fix the autolinking issue
const fixAutolinkingIssue = () => {
  const autolinkDir = path.join(process.cwd(), 'android/build/generated/autolinking');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(autolinkDir)) {
    fs.mkdirSync(autolinkDir, { recursive: true });
    console.log('Created autolinking directory');
  }
  
  // Create an empty autolinking.json file
  const autolinkFile = path.join(autolinkDir, 'autolinking.json');
  fs.writeFileSync(autolinkFile, '{}', 'utf8');
  console.log('Created autolinking.json file');
};

// Clean the Android build
const cleanAndroidBuild = () => {
  try {
    console.log('Cleaning Android build...');
    execSync('cd android && ./gradlew clean', { stdio: 'inherit' });
    console.log('Android build cleaned successfully');
  } catch (error) {
    console.error('Error cleaning Android build:', error);
  }
};

// Create a deployment guide
const createDeploymentGuide = () => {
  const content = `# QuickAudit App Deployment Guide

## Overview

This guide provides instructions for deploying the QuickAudit app to both iOS and Android platforms.

## Prerequisites

- Xcode 14.0 or later (for iOS)
- Android Studio (for Android)
- Node.js 16 or later
- CocoaPods (for iOS)
- A valid Apple Developer account (for iOS App Store)
- A Google Play Console account (for Android Play Store)

## Building for iOS

### Development Build

1. Install dependencies:
   \`\`\`bash
   npm install
   cd ios
   pod install
   cd ..
   \`\`\`

2. Run the app in development mode:
   \`\`\`bash
   npx react-native run-ios
   \`\`\`

### Production Build

1. Open the Xcode workspace:
   \`\`\`bash
   open ios/QuickAuditApp.xcworkspace
   \`\`\`

2. In Xcode, select "Product" > "Archive"

3. Once the archive is created, click "Distribute App" and follow the prompts to upload to the App Store

## Building for Android

### Development Build

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run the app in development mode:
   \`\`\`bash
   npx react-native run-android
   \`\`\`

### Production Build

1. Create a keystore file for signing the app (if not already created):
   \`\`\`bash
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/release-key.keystore -alias release-key-alias -keyalg RSA -keysize 2048 -validity 10000
   \`\`\`

2. Update the \`android/gradle.properties\` file with your keystore details:
   \`\`\`
   MYAPP_RELEASE_STORE_FILE=release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=release-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   \`\`\`

3. Build the release APK:
   \`\`\`bash
   cd android
   ./gradlew assembleRelease
   \`\`\`

4. The APK will be generated at \`android/app/build/outputs/apk/release/app-release.apk\`

5. For App Bundle (recommended for Play Store):
   \`\`\`bash
   cd android
   ./gradlew bundleRelease
   \`\`\`

6. The AAB will be generated at \`android/app/build/outputs/bundle/release/app-release.aab\`

## Troubleshooting

### Common iOS Issues

1. **Pod install fails**:
   - Try \`pod repo update\` and then \`pod install\` again
   - Delete the \`Podfile.lock\` file and run \`pod install\` again

2. **Build fails with signing issues**:
   - Verify your provisioning profiles in Xcode
   - Check that your Bundle Identifier matches your provisioning profile

### Common Android Issues

1. **Gradle build fails**:
   - Run \`./gradlew clean\` and try again
   - Update the Gradle version in \`android/gradle/wrapper/gradle-wrapper.properties\`

2. **Autolinking issues**:
   - Run the fix-android-build.js script:
     \`\`\`bash
     node scripts/fix-android-build.js
     \`\`\`

## Submission Guidelines

### App Store (iOS)

1. Prepare screenshots for various device sizes
2. Create an app description, keywords, and privacy policy
3. Complete the App Review Information section
4. Submit for review

### Play Store (Android)

1. Prepare screenshots for various device sizes
2. Create an app description, keywords, and privacy policy
3. Complete the content rating questionnaire
4. Submit for review

## Post-Deployment

1. Monitor crash reports and user feedback
2. Prepare updates based on user feedback
3. Maintain the app with regular updates

`;

  fs.writeFileSync('DEPLOYMENT_GUIDE.md', content, 'utf8');
  console.log('Created DEPLOYMENT_GUIDE.md');
};

// Run all functions
console.log('Fixing Android build issues...');
fixAutolinkingIssue();
cleanAndroidBuild();
createDeploymentGuide();
console.log('Android build issues fixed successfully!');
console.log('Run `npx react-native run-android` to start the app on an Android device or emulator.');
