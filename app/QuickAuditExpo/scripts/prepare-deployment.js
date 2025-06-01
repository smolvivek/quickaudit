const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing QuickAudit for deployment...');

// Ensure all directories exist
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Paths
const projectRoot = path.resolve(__dirname, '..');
const iosDir = path.join(projectRoot, 'ios');
const androidDir = path.join(projectRoot, 'android');

// Ensure directories exist
ensureDirectoryExists(path.join(projectRoot, 'assets/images'));
ensureDirectoryExists(iosDir);
ensureDirectoryExists(androidDir);

// Fix package.json if needed
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Ensure build scripts exist
  if (!packageJson.scripts) packageJson.scripts = {};
  if (!packageJson.scripts.build) packageJson.scripts.build = 'expo export';
  if (!packageJson.scripts['build:ios']) packageJson.scripts['build:ios'] = 'expo run:ios';
  if (!packageJson.scripts['build:android']) packageJson.scripts['build:android'] = 'expo run:android';
  
  // Write updated package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Updated package.json with build scripts');
}

// Create eas.json for EAS Build if it doesn't exist
const easJsonPath = path.join(projectRoot, 'eas.json');
if (!fs.existsSync(easJsonPath)) {
  const easJson = {
    "cli": {
      "version": ">= 3.13.3"
    },
    "build": {
      "development": {
        "developmentClient": true,
        "distribution": "internal"
      },
      "preview": {
        "distribution": "internal"
      },
      "production": {}
    },
    "submit": {
      "production": {}
    }
  };
  
  fs.writeFileSync(easJsonPath, JSON.stringify(easJson, null, 2));
  console.log('✅ Created eas.json for EAS Build');
}

// Create .xcode.env file for iOS
const xcodeEnvPath = path.join(iosDir, '.xcode.env');
if (!fs.existsSync(xcodeEnvPath)) {
  const xcodeEnvContent = `# This file contains the XCode build settings for this project.
# It is used by the React Native CLI to generate the correct build settings.
# It should be checked into version control.

# iOS deployment target
export IPHONEOS_DEPLOYMENT_TARGET=13.0
  
# Use legacy build system
export USE_LEGACY_BUILD_SYSTEM=0
`;
  
  fs.writeFileSync(xcodeEnvPath, xcodeEnvContent);
  console.log('✅ Created .xcode.env file for iOS');
}

console.log('\n🔍 Checking dependencies...');
try {
  execSync('npm install', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
}

console.log('\n🎉 Deployment preparation complete!');
console.log('\nNext steps:');
console.log('1. Run "npx expo start" to test in Expo Go');
console.log('2. Run "npm run build:ios" to build for iOS');
console.log('3. Run "npm run build:android" to build for Android');
console.log('4. For production builds, use "npx eas build --platform all"');
