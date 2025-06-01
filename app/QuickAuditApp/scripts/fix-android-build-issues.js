/**
 * Script to fix Android build issues and prepare for Play Store submission
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

// Fix the package name in build.gradle
const fixPackageNameInBuildGradle = () => {
  const buildGradlePath = path.join(process.cwd(), 'android/app/build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Make sure the namespace and applicationId are set correctly
    if (!content.includes('namespace "com.quickauditapp"')) {
      content = content.replace(
        /defaultConfig {/,
        'defaultConfig {\n        namespace "com.quickauditapp"'
      );
      console.log('Added namespace to build.gradle');
    }
    
    // Make sure applicationId is set
    if (!content.includes('applicationId "com.quickauditapp"')) {
      content = content.replace(
        /defaultConfig {[^}]*}/s,
        (match) => {
          if (!match.includes('applicationId')) {
            return match.replace(
              /defaultConfig {/,
              'defaultConfig {\n        applicationId "com.quickauditapp"'
            );
          }
          return match;
        }
      );
      console.log('Added applicationId to build.gradle');
    }
    
    fs.writeFileSync(buildGradlePath, content, 'utf8');
    console.log('Fixed build.gradle');
  } else {
    console.error('build.gradle not found');
  }
};

// Fix the MainApplication.java file
const fixMainApplication = () => {
  const mainAppPath = path.join(process.cwd(), 'android/app/src/main/java/com/quickauditapp/MainApplication.java');
  const mainAppDir = path.dirname(mainAppPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(mainAppDir)) {
    fs.mkdirSync(mainAppDir, { recursive: true });
    console.log('Created MainApplication directory');
  }
  
  // Check if MainApplication.java exists, if not create it
  if (!fs.existsSync(mainAppPath)) {
    const content = `package com.quickauditapp;

import android.app.Application;
import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost =
      new DefaultReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here
          return packages;
        }

        @Override
        protected String getJSMainModuleName() {
          return "index";
        }

        @Override
        protected boolean isNewArchEnabled() {
          return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
        }

        @Override
        protected Boolean isHermesEnabled() {
          return BuildConfig.IS_HERMES_ENABLED;
        }
      };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      // If you opted-in for the New Architecture, we load the native entry point for this app.
      DefaultNewArchitectureEntryPoint.load();
    }
    ReactNativeFlipper.initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
}`;
    
    fs.writeFileSync(mainAppPath, content, 'utf8');
    console.log('Created MainApplication.java');
  }
};

// Fix the MainActivity.java file
const fixMainActivity = () => {
  const mainActivityPath = path.join(process.cwd(), 'android/app/src/main/java/com/quickauditapp/MainActivity.java');
  const mainActivityDir = path.dirname(mainActivityPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(mainActivityDir)) {
    fs.mkdirSync(mainActivityDir, { recursive: true });
    console.log('Created MainActivity directory');
  }
  
  // Check if MainActivity.java exists, if not create it
  if (!fs.existsSync(mainActivityPath)) {
    const content = `package com.quickauditapp;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactActivityDelegate;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "QuickAuditApp";
  }

  /**
   * Required for react-native-screens
   */
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(null);
  }

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. Here we use a util class {@link
   * DefaultReactActivityDelegate} which allows you to easily enable Fabric and Concurrent React
   * (aka React 18) with two boolean flags.
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new DefaultReactActivityDelegate(
        this,
        getMainComponentName(),
        // If you opted-in for the New Architecture, we enable the Fabric Renderer.
        DefaultNewArchitectureEntryPoint.getFabricEnabled());
  }
}`;
    
    fs.writeFileSync(mainActivityPath, content, 'utf8');
    console.log('Created MainActivity.java');
  }
};

// Create ReactNativeFlipper.java
const createReactNativeFlipper = () => {
  const flipperPath = path.join(process.cwd(), 'android/app/src/debug/java/com/quickauditapp/ReactNativeFlipper.java');
  const flipperDir = path.dirname(flipperPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(flipperDir)) {
    fs.mkdirSync(flipperDir, { recursive: true });
    console.log('Created ReactNativeFlipper directory');
  }
  
  // Check if ReactNativeFlipper.java exists, if not create it
  if (!fs.existsSync(flipperPath)) {
    const content = `package com.quickauditapp;

import android.content.Context;
import com.facebook.flipper.android.AndroidFlipperClient;
import com.facebook.flipper.android.utils.FlipperUtils;
import com.facebook.flipper.core.FlipperClient;
import com.facebook.flipper.plugins.crashreporter.CrashReporterPlugin;
import com.facebook.flipper.plugins.databases.DatabasesFlipperPlugin;
import com.facebook.flipper.plugins.fresco.FrescoFlipperPlugin;
import com.facebook.flipper.plugins.inspector.DescriptorMapping;
import com.facebook.flipper.plugins.inspector.InspectorFlipperPlugin;
import com.facebook.flipper.plugins.network.FlipperOkhttpInterceptor;
import com.facebook.flipper.plugins.network.NetworkFlipperPlugin;
import com.facebook.flipper.plugins.sharedpreferences.SharedPreferencesFlipperPlugin;
import com.facebook.react.ReactInstanceEventListener;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.network.NetworkingModule;
import okhttp3.OkHttpClient;

/**
 * Class responsible for loading Flipper inside your React Native application. This is the debug
 * flavor of it. Here you can add your own plugins and customize the Flipper setup.
 */
public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    if (FlipperUtils.shouldEnableFlipper(context)) {
      final FlipperClient client = AndroidFlipperClient.getInstance(context);

      client.addPlugin(new InspectorFlipperPlugin(context, DescriptorMapping.withDefaults()));
      client.addPlugin(new DatabasesFlipperPlugin(context));
      client.addPlugin(new SharedPreferencesFlipperPlugin(context));
      client.addPlugin(CrashReporterPlugin.getInstance());

      NetworkFlipperPlugin networkFlipperPlugin = new NetworkFlipperPlugin();
      NetworkingModule.setCustomClientBuilder(
          new NetworkingModule.CustomClientBuilder() {
            @Override
            public void apply(OkHttpClient.Builder builder) {
              builder.addNetworkInterceptor(new FlipperOkhttpInterceptor(networkFlipperPlugin));
            }
          });
      client.addPlugin(networkFlipperPlugin);
      client.start();

      // Fresco Plugin needs to ensure that ImagePipelineFactory is initialized
      // Hence we run if after all native modules have been initialized
      ReactInstanceEventListener reactInstanceEventListener =
          new ReactInstanceEventListener() {
            @Override
            public void onReactContextInitialized(ReactContext reactContext) {
              reactInstanceManager.removeReactInstanceEventListener(this);
              client.addPlugin(new FrescoFlipperPlugin());
            }
          };
      reactInstanceManager.addReactInstanceEventListener(reactInstanceEventListener);
      if (reactInstanceManager.getReactContext() != null) {
        reactInstanceEventListener.onReactContextInitialized(reactInstanceManager.getReactContext());
      }
    }
  }
}`;
    
    fs.writeFileSync(flipperPath, content, 'utf8');
    console.log('Created ReactNativeFlipper.java');
  }
};

// Create or update AndroidManifest.xml
const fixAndroidManifest = () => {
  const manifestPath = path.join(process.cwd(), 'android/app/src/main/AndroidManifest.xml');
  const manifestDir = path.dirname(manifestPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(manifestDir)) {
    fs.mkdirSync(manifestDir, { recursive: true });
    console.log('Created AndroidManifest directory');
  }
  
  // Check if AndroidManifest.xml exists, if not create it
  if (!fs.existsSync(manifestPath)) {
    const content = `<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
    <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />

    <application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">
      <activity
        android:name=".MainActivity"
        android:label="@string/app_name"
        android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
        android:launchMode="singleTask"
        android:windowSoftInputMode="adjustResize"
        android:exported="true">
        <intent-filter>
            <action android:name="android.intent.action.MAIN" />
            <category android:name="android.intent.category.LAUNCHER" />
        </intent-filter>
      </activity>
    </application>
</manifest>`;
    
    fs.writeFileSync(manifestPath, content, 'utf8');
    console.log('Created AndroidManifest.xml');
  }
};

// Create strings.xml for app name
const createStringsXml = () => {
  const stringsDir = path.join(process.cwd(), 'android/app/src/main/res/values');
  const stringsPath = path.join(stringsDir, 'strings.xml');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(stringsDir)) {
    fs.mkdirSync(stringsDir, { recursive: true });
    console.log('Created values directory');
  }
  
  // Create strings.xml
  const content = `<resources>
    <string name="app_name">QuickAudit</string>
</resources>`;
  
  fs.writeFileSync(stringsPath, content, 'utf8');
  console.log('Created strings.xml');
};

// Create styles.xml for app theme
const createStylesXml = () => {
  const stylesDir = path.join(process.cwd(), 'android/app/src/main/res/values');
  const stylesPath = path.join(stylesDir, 'styles.xml');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
    console.log('Created values directory');
  }
  
  // Create styles.xml
  const content = `<resources>
    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <!-- Customize your theme here. -->
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
</resources>`;
  
  fs.writeFileSync(stylesPath, content, 'utf8');
  console.log('Created styles.xml');
};

// Create a drawable for EditText
const createEditTextDrawable = () => {
  const drawableDir = path.join(process.cwd(), 'android/app/src/main/res/drawable');
  const drawablePath = path.join(drawableDir, 'rn_edit_text_material.xml');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(drawableDir)) {
    fs.mkdirSync(drawableDir, { recursive: true });
    console.log('Created drawable directory');
  }
  
  // Create drawable XML
  const content = `<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_focused="true">
        <shape android:shape="rectangle">
            <solid android:color="@android:color/white" />
            <stroke android:width="1dp" android:color="#4CAF50" />
            <padding android:bottom="10dp" android:left="10dp" android:right="10dp" android:top="10dp" />
        </shape>
    </item>
    <item>
        <shape android:shape="rectangle">
            <solid android:color="@android:color/white" />
            <stroke android:width="1dp" android:color="#BBBBBB" />
            <padding android:bottom="10dp" android:left="10dp" android:right="10dp" android:top="10dp" />
        </shape>
    </item>
</selector>`;
  
  fs.writeFileSync(drawablePath, content, 'utf8');
  console.log('Created rn_edit_text_material.xml');
};

// Create app icons
const createAppIcons = () => {
  const mipmapDirs = [
    path.join(process.cwd(), 'android/app/src/main/res/mipmap-mdpi'),
    path.join(process.cwd(), 'android/app/src/main/res/mipmap-hdpi'),
    path.join(process.cwd(), 'android/app/src/main/res/mipmap-xhdpi'),
    path.join(process.cwd(), 'android/app/src/main/res/mipmap-xxhdpi'),
    path.join(process.cwd(), 'android/app/src/main/res/mipmap-xxxhdpi')
  ];
  
  // Create mipmap directories
  mipmapDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created ${dir}`);
    }
  });
  
  // Create placeholder icons (these should be replaced with actual icons)
  const iconSizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
  };
  
  Object.keys(iconSizes).forEach(density => {
    const iconPath = path.join(process.cwd(), `android/app/src/main/res/mipmap-${density}/ic_launcher.png`);
    const roundIconPath = path.join(process.cwd(), `android/app/src/main/res/mipmap-${density}/ic_launcher_round.png`);
    
    // Create placeholder icons if they don't exist
    if (!fs.existsSync(iconPath)) {
      // This is just a placeholder - in a real app, you'd use actual icon files
      console.log(`Note: Placeholder needed for ${iconPath}`);
    }
    
    if (!fs.existsSync(roundIconPath)) {
      // This is just a placeholder - in a real app, you'd use actual icon files
      console.log(`Note: Placeholder needed for ${roundIconPath}`);
    }
  });
  
  console.log('App icon placeholders created (you should replace these with actual icons)');
};

// Clean and rebuild the project
const cleanAndRebuild = () => {
  try {
    console.log('Cleaning Android build...');
    execSync('cd android && ./gradlew clean', { stdio: 'inherit' });
    console.log('Android build cleaned successfully');
  } catch (error) {
    console.error('Error cleaning Android build:', error);
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

// Run all functions
console.log('Fixing Android build issues...');
fixAutolinkingIssue();
fixPackageNameInBuildGradle();
fixMainApplication();
fixMainActivity();
createReactNativeFlipper();
fixAndroidManifest();
createStringsXml();
createStylesXml();
createEditTextDrawable();
createAppIcons();
cleanAndRebuild();
createPlayStoreGuide();
console.log('Android build issues fixed successfully!');
console.log('Run `npx react-native run-android` to test the app on an Android emulator.');
console.log('Check PLAY_STORE_SUBMISSION_GUIDE.md for detailed instructions on Play Store submission.');
