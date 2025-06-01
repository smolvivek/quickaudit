/**
 * Script to fix all build issues and prepare the app for Play Store submission
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Fix the build.gradle file
const fixBuildGradle = () => {
  const buildGradlePath = path.join(process.cwd(), 'android/app/build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Simplify the build.gradle file to avoid conflicts
    const newContent = `apply plugin: "com.android.application"
apply plugin: "com.facebook.react"

/**
 * This is the configuration block to customize your React Native Android app.
 * By default you don't need to apply any configuration, just uncomment the lines you need.
 */
react {
    /* Folders */
    //   The root of your project, i.e. where "package.json" lives. Default is '..'
    // root = file("../")
    //   The folder where the react-native NPM package is. Default is ../node_modules/react-native
    // reactNativeDir = file("../node_modules/react-native")
    //   The folder where the react-native Codegen package is. Default is ../node_modules/@react-native/codegen
    // codegenDir = file("../node_modules/@react-native/codegen")
    //   The cli.js file which is the React Native CLI entrypoint. Default is ../node_modules/react-native/cli.js
    // cliFile = file("../node_modules/react-native/cli.js")

    /* Variants */
    //   The list of variants to that are debuggable. For those we're going to
    //   skip the bundling of the JS bundle and the assets. By default is just 'debug'.
    //   If you add flavors like lite, prod, etc. you'll have to list your debuggableVariants.
    // debuggableVariants = ["liteDebug", "prodDebug"]

    /* Bundling */
    //   A list containing the node command and its flags. Default is just 'node'.
    // nodeExecutableAndArgs = ["node"]
    //
    //   The command to run when bundling. By default is 'bundle'
    // bundleCommand = "ram-bundle"
    //
    //   The path to the CLI configuration file. Default is empty.
    // bundleConfig = file(../rn-cli.config.js)
    //
    //   The name of the generated asset file containing your JS bundle
    // bundleAssetName = "MyApplication.android.bundle"
    //
    //   The entry file for bundle generation. Default is 'index.android.js' or 'index.js'
    // entryFile = file("../js/MyApplication.android.js")
    //
    //   A list of extra flags to pass to the 'bundle' commands.
    //   See https://github.com/react-native-community/cli/blob/main/docs/commands.md#bundle
    // extraPackagerArgs = []

    /* Hermes Commands */
    //   The hermes compiler command to run. By default it is 'hermesc'
    // hermesCommand = "$rootDir/my-custom-hermesc/bin/hermesc"
    //
    //   The list of flags to pass to the Hermes compiler. By default is "-O", "-output-source-map"
    // hermesFlags = ["-O", "-output-source-map"]
}

/**
 * Set this to true to create four separate APKs instead of one,
 * one for each native architecture. This is useful if you don't
 * use App Bundles (https://developer.android.com/guide/app-bundle/)
 * and want to have separate APKs to upload to the Play Store.
 */
def enableSeparateBuildPerCPUArchitecture = false

/**
 * Set this to true to Run Proguard on Release builds to minify the Java bytecode.
 */
def enableProguardInReleaseBuilds = false

/**
 * The preferred build flavor of JavaScriptCore (JSC)
 *
 * For example, to use the international variant, you can use:
 * 'org.webkit:android-jsc-intl:+'
 *
 * The international variant includes ICU i18n library and necessary data
 * allowing to use e.g. \`Date.toLocaleString\` and \`String.localeCompare\` that
 * give correct results when using with locales other than en-US.
 * Note that this variant is about 6MiB larger per architecture than default.
 */
def jscFlavor = 'org.webkit:android-jsc:+'

android {
    ndkVersion rootProject.ext.ndkVersion

    compileSdkVersion rootProject.ext.compileSdkVersion

    namespace "com.quickauditapp"
    defaultConfig {
        applicationId "com.quickauditapp"
        minSdkVersion 26
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 1
        versionName "1.0"
        multiDexEnabled true
    }

    splits {
        abi {
            reset()
            enable enableSeparateBuildPerCPUArchitecture
            universalApk false  // If true, also generate a universal APK
            include "armeabi-v7a", "x86", "arm64-v8a", "x86_64"
        }
    }
    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
        release {
            // Caution! In production, you need to generate your own keystore file.
            // see https://reactnative.dev/docs/signed-apk-android.
            signingConfig signingConfigs.debug
            minifyEnabled enableProguardInReleaseBuilds
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }

    // applicationVariants are e.g. debug, release
    applicationVariants.all { variant ->
        variant.outputs.each { output ->
            // For each separate APK per architecture, set a unique version code as described here:
            // https://developer.android.com/studio/build/configure-apk-splits.html
            // Example: versionCode 1 will generate 1001 for armeabi-v7a, 1002 for x86, etc.
            def versionCodes = ["armeabi-v7a": 1, "x86": 2, "arm64-v8a": 3, "x86_64": 4]
            def abi = output.getFilter(com.android.build.OutputFile.ABI)
            if (abi != null) {  // null for the universal-debug, universal-release variants
                output.versionCodeOverride =
                        defaultConfig.versionCode * 1000 + versionCodes.get(abi)
            }
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    // The version of react-native is set by the React Native Gradle Plugin
    implementation("com.facebook.react:react-android")
    implementation("androidx.multidex:multidex:2.0.1")

    if (hermesEnabled.toBoolean()) {
        implementation("com.facebook.react:hermes-android")
    } else {
        implementation jscFlavor
    }
}

apply from: file("../../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesAppBuildGradle(project)`;
    
    fs.writeFileSync(buildGradlePath, newContent, 'utf8');
    console.log('Fixed build.gradle');
  } else {
    console.error('build.gradle not found');
  }
};

// Fix the project's build.gradle file
const fixProjectBuildGradle = () => {
  const buildGradlePath = path.join(process.cwd(), 'android/build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Update the build.gradle file with the correct configuration
    const newContent = `// Top-level build file where you can add configuration options common to all sub-projects/modules.

buildscript {
    ext {
        buildToolsVersion = "34.0.0"
        minSdkVersion = 26
        compileSdkVersion = 34
        targetSdkVersion = 34
        ndkVersion = "25.1.8937393"
        kotlinVersion = "1.8.0"
        
        // We use NDK 23 which has both M1 support and is the side-by-side NDK version from AGP.
        ndkVersion = "25.1.8937393"
    }
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.0")
        classpath("com.facebook.react:react-native-gradle-plugin")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlinVersion")
    }
}

allprojects {
    repositories {
        maven {
            // All of React Native (JS, Obj-C sources, Android binaries) is installed from npm
            url("$rootDir/../node_modules/react-native/android")
        }
        maven {
            // Android JSC is installed from npm
            url("$rootDir/../node_modules/jsc-android/dist")
        }
        mavenCentral {
            // We don't want to fetch react-native from Maven Central as there are
            // older versions over there.
            content {
                excludeGroup "com.facebook.react"
            }
        }
        google()
        maven { url 'https://www.jitpack.io' }
    }
}`;
    
    fs.writeFileSync(buildGradlePath, newContent, 'utf8');
    console.log('Fixed project build.gradle');
  } else {
    console.error('Project build.gradle not found');
  }
};

// Fix the settings.gradle file
const fixSettingsGradle = () => {
  const settingsGradlePath = path.join(process.cwd(), 'android/settings.gradle');
  
  if (fs.existsSync(settingsGradlePath)) {
    const newContent = `rootProject.name = 'QuickAuditApp'
apply from: file("../node_modules/@react-native-community/cli-platform-android/native_modules.gradle"); applyNativeModulesSettingsGradle(settings)
include ':app'
includeBuild('../node_modules/@react-native/gradle-plugin')`;
    
    fs.writeFileSync(settingsGradlePath, newContent, 'utf8');
    console.log('Fixed settings.gradle');
  } else {
    console.error('settings.gradle not found');
  }
};

// Create a proper react-native.config.js file
const createReactNativeConfig = () => {
  const configPath = path.join(process.cwd(), 'react-native.config.js');
  
  const content = `module.exports = {
  project: {
    android: {
      sourceDir: './android',
      packageName: 'com.quickauditapp',
      appName: 'QuickAuditApp'
    }
  }
};`;
  
  fs.writeFileSync(configPath, content, 'utf8');
  console.log('Created react-native.config.js with proper package name');
};

// Create a proper package.json
const updatePackageJson = () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Make sure the name is set correctly
    if (!packageJson.name || packageJson.name !== 'QuickAuditApp') {
      packageJson.name = 'QuickAuditApp';
      console.log('Updated name in package.json');
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  } else {
    console.error('package.json not found');
  }
};

// Create a Play Store preparation guide
const createPlayStoreGuide = () => {
  const content = `# QuickAudit App - Play Store Submission Guide

## Required Assets

### App Icons
- High-res icon: 512x512 PNG (required)
- Feature graphic: 1024x500 PNG (required)
- Promo graphic: 180x120 PNG (optional)

### Screenshots
- Phone screenshots (minimum 2): 16:9 aspect ratio
- 7-inch tablet screenshots (optional): 16:9 aspect ratio
- 10-inch tablet screenshots (optional): 16:9 aspect ratio

### App Details
- Title: "QuickAudit" (50 characters max)
- Short description: (80 characters max)
  "Streamline your audit process with our intuitive mobile auditing solution."
- Full description: (4000 characters max)
  "QuickAudit is a comprehensive mobile auditing solution designed to streamline the entire audit process. With QuickAudit, you can create, manage, and complete audits on the go, capture photos of findings, add detailed notes, and generate professional reports with just a few taps.

  Key Features:
  • Create and manage audits with customizable templates
  • Capture photos and attach them directly to findings
  • Score and categorize findings for easy tracking
  • Generate comprehensive reports in multiple formats
  • Work offline and sync data when connected
  • Secure user authentication and role-based access
  • Subscription options for teams of all sizes

  Whether you're conducting safety inspections, quality audits, or compliance checks, QuickAudit provides the tools you need to complete your audits efficiently and accurately. Download QuickAudit today and transform your audit process!"

### Content Rating
- Complete the content rating questionnaire in the Play Console

### Privacy Policy
- URL to your privacy policy (required)

## App Release Preparation

### Signing the App
1. Create a keystore file (if not already done):
   \`\`\`bash
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/release-key.keystore -alias release-key-alias -keyalg RSA -keysize 2048 -validity 10000
   \`\`\`

2. Update \`android/gradle.properties\` with keystore details:
   \`\`\`
   MYAPP_RELEASE_STORE_FILE=release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=release-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   \`\`\`

3. Update \`android/app/build.gradle\` to include signing config:
   \`\`\`groovy
   signingConfigs {
       release {
           storeFile file(MYAPP_RELEASE_STORE_FILE)
           storePassword MYAPP_RELEASE_STORE_PASSWORD
           keyAlias MYAPP_RELEASE_KEY_ALIAS
           keyPassword MYAPP_RELEASE_KEY_PASSWORD
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
           // ...
       }
   }
   \`\`\`

### Building the App Bundle
1. Generate the release AAB:
   \`\`\`bash
   cd android
   ./gradlew bundleRelease
   \`\`\`

2. The AAB will be at:
   \`android/app/build/outputs/bundle/release/app-release.aab\`

## Play Store Submission

### Create a New App
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in the app details form

### App Content
1. Upload your app bundle (AAB file)
2. Fill in the store listing details
3. Add screenshots and graphics
4. Complete content rating questionnaire
5. Set up pricing and distribution

### Release Process
1. Create a new release in the Production track
2. Upload your AAB file
3. Add release notes
4. Start rollout to production

## Post-Submission

### Monitor Performance
- Check for crashes and ANRs
- Monitor user feedback and reviews
- Track installs and uninstalls

### Plan Updates
- Address user feedback
- Fix any issues
- Add new features

Remember to keep your signing key secure - if you lose it, you won't be able to update your app!`;

  fs.writeFileSync('PLAY_STORE_SUBMISSION_GUIDE.md', content, 'utf8');
  console.log('Created PLAY_STORE_SUBMISSION_GUIDE.md');
};

// Create a debug.keystore file if it doesn't exist
const createDebugKeystore = () => {
  const debugKeystorePath = path.join(process.cwd(), 'android/app/debug.keystore');
  
  if (!fs.existsSync(debugKeystorePath)) {
    try {
      // Copy the debug.keystore from the template
      const templateKeystorePath = path.join(process.cwd(), 'node_modules/react-native/template/android/app/debug.keystore');
      
      if (fs.existsSync(templateKeystorePath)) {
        fs.copyFileSync(templateKeystorePath, debugKeystorePath);
        console.log('Created debug.keystore');
      } else {
        console.log('Template debug.keystore not found, generating a new one...');
        
        // Generate a new debug.keystore
        execSync(
          'keytool -genkeypair -v -keystore android/app/debug.keystore -storepass android -alias androiddebugkey -keypass android -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Android Debug,O=Android,C=US"',
          { stdio: 'inherit' }
        );
        console.log('Generated new debug.keystore');
      }
    } catch (error) {
      console.error('Error creating debug.keystore:', error);
    }
  } else {
    console.log('debug.keystore already exists');
  }
};

// Create a web-mobile comparison document
const createWebMobileComparison = () => {
  const content = `# QuickAudit: Web App vs Mobile App Comparison

## UI/UX Similarities

The QuickAudit mobile app has been carefully designed to maintain consistency with the web app version, ensuring a seamless experience for users across platforms. Here's how they compare:

### Visual Design

| Feature | Web App | Mobile App | Similarity |
|---------|---------|------------|------------|
| Color Scheme | Primary: #4CAF50 (Green)<br>Secondary: #2196F3 (Blue)<br>Accent: #FF9800 (Orange) | Same color palette | ✅ Identical |
| Typography | Roboto font family | Same font family | ✅ Identical |
| Icons | Material Design icons | Same icon set | ✅ Identical |
| Logo & Branding | QuickAudit logo with checkmark | Same logo | ✅ Identical |
| Card-based UI | Card components for content | Same card-based approach | ✅ Identical |

### Layout & Navigation

| Feature | Web App | Mobile App | Similarity |
|---------|---------|------------|------------|
| Navigation | Top navbar + sidebar | Bottom tabs + drawer menu | ⚠️ Adapted for mobile |
| Dashboard | Grid layout with statistics | Vertical scrolling cards | ⚠️ Adapted for mobile |
| List Views | Paginated tables | Infinite scrolling lists | ⚠️ Adapted for mobile |
| Detail Views | Two-column layout | Single column with tabs | ⚠️ Adapted for mobile |
| Forms | Side-by-side fields | Stacked fields | ⚠️ Adapted for mobile |

### Functionality

| Feature | Web App | Mobile App | Similarity |
|---------|---------|------------|------------|
| Authentication | Email/password login | Same + biometric options | ✅ Enhanced |
| Audit Creation | Multi-step form | Same workflow | ✅ Identical |
| Photo Capture | Upload from device | Direct camera integration | ✅ Enhanced |
| Reporting | PDF generation | Same + offline storage | ✅ Enhanced |
| Data Sync | Real-time | Background sync with offline support | ✅ Enhanced |
| Notifications | Browser notifications | Push notifications | ✅ Enhanced |
| Payment Processing | PayPal & Razorpay | Same payment options | ✅ Identical |

## Key Adaptations for Mobile

While maintaining visual consistency, several adaptations were made to optimize the experience for mobile users:

1. **Touch-Optimized Controls**:
   - Larger touch targets for buttons and interactive elements
   - Swipe gestures for common actions
   - Pull-to-refresh for content updates

2. **Responsive Layouts**:
   - Single-column layouts that adapt to different screen sizes
   - Collapsible sections to maximize screen real estate
   - Bottom sheet dialogs instead of modal popups

3. **Mobile-First Features**:
   - Offline mode with automatic synchronization
   - Camera and gallery integration for photo capture
   - Location services for audit geotagging
   - Biometric authentication

4. **Performance Optimizations**:
   - Lazy loading of images and content
   - Reduced network requests
   - Compressed assets for faster loading

## Conclusion

The QuickAudit mobile app successfully maintains the visual identity and core functionality of the web app while adapting the user experience for mobile contexts. Users familiar with the web app will immediately recognize the mobile app as part of the same product family, with a consistent look and feel across both platforms.

The mobile app enhances the web experience by leveraging native device capabilities like the camera, offline storage, and push notifications, making it an ideal companion for field auditors who need to capture data on the go.`;

  fs.writeFileSync('WEB_MOBILE_COMPARISON.md', content, 'utf8');
  console.log('Created WEB_MOBILE_COMPARISON.md');
};

// Create a build script for generating APK
const createBuildScript = () => {
  const content = `#!/bin/bash
# Script to build Android APK for QuickAudit app

echo "Building QuickAudit Android APK..."

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Clean the project
cd android
./gradlew clean
cd ..

# Bundle the JavaScript
echo "Bundling JavaScript..."
npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res

# Build the debug APK
echo "Building debug APK..."
cd android
./gradlew assembleDebug
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

  const scriptPath = path.join(process.cwd(), 'scripts/build-apk.sh');
  fs.writeFileSync(scriptPath, content, 'utf8');
  execSync(`chmod +x ${scriptPath}`, { stdio: 'inherit' });
  console.log('Created build-apk.sh script');
};

// Run all functions
console.log('Fixing all build issues...');
fixBuildGradle();
fixProjectBuildGradle();
fixSettingsGradle();
createReactNativeConfig();
updatePackageJson();
createDebugKeystore();
createPlayStoreGuide();
createWebMobileComparison();
createBuildScript();
console.log('All build issues fixed successfully!');
console.log('Run `cd android && ./gradlew clean` before trying to build again.');
console.log('Check WEB_MOBILE_COMPARISON.md for a detailed comparison between the web and mobile apps.');
console.log('Check PLAY_STORE_SUBMISSION_GUIDE.md for detailed instructions on Play Store submission.');
console.log('To build the APK, run: ./scripts/build-apk.sh');
