/**
 * Script to build an Android APK for sharing with friends
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create the assets directory if it doesn't exist
const createAssetsDirectory = () => {
  const assetsDir = path.join(process.cwd(), 'android/app/src/main/assets');
  
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
    console.log('Created assets directory');
  }
};

// Bundle the JavaScript code
const bundleJavaScript = () => {
  try {
    console.log('Bundling JavaScript...');
    execSync('npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res', 
      { stdio: 'inherit' });
    console.log('JavaScript bundled successfully');
  } catch (error) {
    console.error('Error bundling JavaScript:', error);
    process.exit(1);
  }
};

// Build the debug APK
const buildDebugApk = () => {
  try {
    console.log('Building debug APK...');
    execSync('cd android && ./gradlew assembleDebug', { stdio: 'inherit' });
    console.log('Debug APK built successfully');
    
    // Get the path to the APK
    const apkPath = path.join(process.cwd(), 'android/app/build/outputs/apk/debug/app-debug.apk');
    
    if (fs.existsSync(apkPath)) {
      console.log(`APK created at: ${apkPath}`);
      
      // Copy the APK to a more accessible location
      const destPath = path.join(process.cwd(), 'QuickAuditApp-debug.apk');
      fs.copyFileSync(apkPath, destPath);
      console.log(`APK copied to: ${destPath}`);
    } else {
      console.error('APK not found at expected location');
    }
  } catch (error) {
    console.error('Error building debug APK:', error);
  }
};

// Create a sharing guide
const createSharingGuide = () => {
  const content = `# QuickAudit App Sharing Guide

## Sharing the Android APK

The QuickAudit app APK has been created and is ready to share with your friend.

### APK Location
- Debug APK: \`QuickAuditApp-debug.apk\` (in the project root directory)

### Sharing Methods

1. **Email**: Attach the APK file to an email and send it to your friend.

2. **Cloud Storage**: Upload the APK to Google Drive, Dropbox, or another cloud storage service and share the link.

3. **Direct Transfer**: Use AirDrop, Bluetooth, or a USB drive to transfer the APK directly.

### Installation Instructions for Your Friend

1. Download the APK file to their Android device.

2. Enable "Install from Unknown Sources" in their device settings:
   - Go to Settings > Security > Install Unknown Apps
   - Select the app you used to download the APK (e.g., Chrome, Files)
   - Toggle "Allow from this source" to ON

3. Open the downloaded APK file to install the app.

4. Once installed, they can open the QuickAudit app from their app drawer.

## Notes

- This is a debug build meant for testing purposes only.
- The app will not automatically update, so you'll need to send a new APK for any updates.
- For a more professional distribution method, consider using TestFlight (iOS) or Internal Testing tracks in Google Play Console.

`;

  fs.writeFileSync('SHARING_GUIDE.md', content, 'utf8');
  console.log('Created SHARING_GUIDE.md');
};

// Run all functions
console.log('Building Android APK for sharing...');
createAssetsDirectory();
bundleJavaScript();
buildDebugApk();
createSharingGuide();
console.log('Android APK build process completed!');
console.log('Check SHARING_GUIDE.md for instructions on how to share the app with your friend.');
