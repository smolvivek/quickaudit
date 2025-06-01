/**
 * Script to fix splash screen resources
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create splash screen color resource
const createSplashScreenColors = () => {
  const colorsDir = path.join(process.cwd(), 'android/app/src/main/res/values');
  const colorsPath = path.join(colorsDir, 'colors.xml');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(colorsDir)) {
    fs.mkdirSync(colorsDir, { recursive: true });
    console.log('Created values directory');
  }
  
  // Create colors.xml with splash screen background color
  const content = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="splashscreen_bg">#4CAF50</color>
    <color name="app_bg">#FFFFFF</color>
</resources>`;
  
  fs.writeFileSync(colorsPath, content, 'utf8');
  console.log('Created colors.xml with splash screen background color');
};

// Create splash screen logo
const createSplashLogo = () => {
  const drawableDir = path.join(process.cwd(), 'android/app/src/main/res/drawable');
  const logoPath = path.join(drawableDir, 'splash_logo.png');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(drawableDir)) {
    fs.mkdirSync(drawableDir, { recursive: true });
    console.log('Created drawable directory');
  }
  
  // Create a simple logo
  const size = 200;
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw a white circle
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Add a checkmark in the center
  ctx.fillStyle = '#4CAF50';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', size / 2, size / 2);
  
  // Save the logo to the output path
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(logoPath, buffer);
  console.log('Created splash_logo.png');
};

// Create splash screen drawable XML
const createSplashScreenXml = () => {
  const drawableDir = path.join(process.cwd(), 'android/app/src/main/res/drawable');
  const splashPath = path.join(drawableDir, 'splash_screen.xml');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(drawableDir)) {
    fs.mkdirSync(drawableDir, { recursive: true });
    console.log('Created drawable directory');
  }
  
  // Create splash_screen.xml
  const content = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:drawable="@color/splashscreen_bg"/>
    <item
        android:width="100dp"
        android:height="100dp"
        android:drawable="@drawable/splash_logo"
        android:gravity="center" />
</layer-list>`;
  
  fs.writeFileSync(splashPath, content, 'utf8');
  console.log('Created splash_screen.xml');
};

// Create or update styles.xml to include splash screen theme
const updateStylesXml = () => {
  const stylesDir = path.join(process.cwd(), 'android/app/src/main/res/values');
  const stylesPath = path.join(stylesDir, 'styles.xml');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(stylesDir)) {
    fs.mkdirSync(stylesDir, { recursive: true });
    console.log('Created values directory');
  }
  
  // Create or update styles.xml
  const content = `<resources>
    <!-- Base application theme. -->
    <style name="AppTheme" parent="Theme.AppCompat.DayNight.NoActionBar">
        <!-- Customize your theme here. -->
        <item name="android:editTextBackground">@drawable/rn_edit_text_material</item>
    </style>
    
    <!-- Splash screen theme -->
    <style name="SplashTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="android:windowBackground">@drawable/splash_screen</item>
        <item name="android:statusBarColor">@color/splashscreen_bg</item>
    </style>
</resources>`;
  
  fs.writeFileSync(stylesPath, content, 'utf8');
  console.log('Updated styles.xml with splash screen theme');
};

// Update AndroidManifest.xml to use splash screen theme
const updateAndroidManifest = () => {
  const manifestPath = path.join(process.cwd(), 'android/app/src/main/AndroidManifest.xml');
  
  if (fs.existsSync(manifestPath)) {
    let content = fs.readFileSync(manifestPath, 'utf8');
    
    // Update the theme attribute in the activity tag
    if (!content.includes('android:theme="@style/SplashTheme"')) {
      content = content.replace(
        /android:theme="@style\/AppTheme"/,
        'android:theme="@style/SplashTheme"'
      );
      fs.writeFileSync(manifestPath, content, 'utf8');
      console.log('Updated AndroidManifest.xml to use splash screen theme');
    }
  } else {
    console.error('AndroidManifest.xml not found');
  }
};

// Run all functions
console.log('Fixing splash screen resources...');
createSplashScreenColors();
createSplashLogo();
createSplashScreenXml();
updateStylesXml();
updateAndroidManifest();
console.log('Splash screen resources fixed successfully!');
console.log('Run `cd android && ./gradlew clean` before trying to build again.');
