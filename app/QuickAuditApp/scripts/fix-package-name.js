/**
 * Script to fix package name issues in Android build
 */

const fs = require('fs');
const path = require('path');

// Fix the package name in build.gradle
const fixBuildGradle = () => {
  const buildGradlePath = path.join(process.cwd(), 'android/app/build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Make sure applicationId is set correctly
    if (!content.includes('applicationId "com.quickauditapp"')) {
      content = content.replace(
        /defaultConfig {[^}]*}/s,
        (match) => {
          if (!match.includes('applicationId')) {
            return match.replace(
              /defaultConfig {/,
              'defaultConfig {\n        applicationId "com.quickauditapp"'
            );
          } else {
            return match.replace(
              /applicationId "[^"]*"/,
              'applicationId "com.quickauditapp"'
            );
          }
          return match;
        }
      );
      console.log('Fixed applicationId in build.gradle');
    }
    
    fs.writeFileSync(buildGradlePath, content, 'utf8');
  } else {
    console.error('build.gradle not found');
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
    
    // Add react-native field if missing
    if (!packageJson['react-native']) {
      packageJson['react-native'] = {
        "android": {
          "packageName": "com.quickauditapp",
          "appName": "QuickAuditApp"
        }
      };
      console.log('Added react-native field to package.json');
    }
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  } else {
    console.error('package.json not found');
  }
};

// Create a temporary autolinking.json file
const createAutolinkingJson = () => {
  const autolinkDir = path.join(process.cwd(), 'android/build/generated/autolinking');
  
  // Create the directory if it doesn't exist
  if (!fs.existsSync(autolinkDir)) {
    fs.mkdirSync(autolinkDir, { recursive: true });
    console.log('Created autolinking directory');
  }
  
  // Create a proper autolinking.json file
  const autolinkFile = path.join(autolinkDir, 'autolinking.json');
  const content = JSON.stringify({
    "project": {
      "android": {
        "packageName": "com.quickauditapp"
      }
    }
  }, null, 2);
  
  fs.writeFileSync(autolinkFile, content, 'utf8');
  console.log('Created autolinking.json with proper package name');
};

// Run all functions
console.log('Fixing package name issues...');
fixBuildGradle();
createReactNativeConfig();
updatePackageJson();
createAutolinkingJson();
console.log('Package name issues fixed successfully!');
console.log('Run `cd android && ./gradlew clean` before trying to build again.');
