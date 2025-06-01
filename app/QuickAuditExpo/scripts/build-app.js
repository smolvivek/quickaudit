const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const projectRoot = path.resolve(__dirname, '..');
const buildType = process.argv[2] || 'preview'; // Options: preview, production
const platform = process.argv[3] || 'all'; // Options: ios, android, all

console.log(`🚀 Building QuickAudit Expo app for ${platform} (${buildType})`);

// Ensure EAS is installed
try {
  execSync('npx eas-cli --version', { stdio: 'ignore' });
} catch (error) {
  console.log('📦 Installing EAS CLI...');
  execSync('npm install -g eas-cli', { stdio: 'inherit' });
}

// Update app.json with current version
const appJsonPath = path.join(projectRoot, 'app.json');
const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
const currentVersion = appJson.expo.version;
const buildNumber = parseInt(appJson.expo.ios?.buildNumber || '1', 10);

console.log(`📱 Current version: ${currentVersion} (Build ${buildNumber})`);

// Update build number
appJson.expo.ios = {
  ...appJson.expo.ios,
  buildNumber: (buildNumber + 1).toString()
};

appJson.expo.android = {
  ...appJson.expo.android,
  versionCode: (buildNumber + 1)
};

fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2));
console.log(`✅ Updated build number to ${buildNumber + 1}`);

// Run the build based on platform
try {
  if (platform === 'ios' || platform === 'all') {
    console.log('🍎 Building for iOS...');
    execSync(`npx eas build --platform ios --profile ${buildType}`, { 
      cwd: projectRoot,
      stdio: 'inherit'
    });
  }
  
  if (platform === 'android' || platform === 'all') {
    console.log('🤖 Building for Android...');
    execSync(`npx eas build --platform android --profile ${buildType}`, { 
      cwd: projectRoot,
      stdio: 'inherit'
    });
  }
  
  console.log('✅ Build completed successfully!');
  console.log('📱 You can view your builds at https://expo.dev/accounts/[your-username]/projects/QuickAuditExpo/builds');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure you are logged in to Expo: npx expo login');
  console.log('2. Check your eas.json configuration');
  console.log('3. For iOS builds, ensure you have the correct Apple Developer credentials');
  console.log('4. For Android builds, ensure you have the correct keystore information');
}
