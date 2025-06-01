/**
 * Script to fix common mobile build issues
 * This script will:
 * 1. Fix Firebase dependency issues in Android
 * 2. Resolve CocoaPods UTF-8 encoding issue for iOS
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Fixing build issues for QuickAudit app...');

// Fix Android Firebase dependency issues
function fixAndroidFirebaseIssues() {
  console.log('Fixing Android Firebase dependency issues...');
  
  const buildGradlePath = path.join(__dirname, '../android/build.gradle');
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Update Firebase dependencies to compatible versions
    content = content.replace(
      /classpath "com.google.gms:google-services:[\d.]+"/, 
      'classpath "com.google.gms:google-services:4.3.15"'
    );
    
    // Add Firebase BoM
    if (!content.includes('platform("com.google.firebase:firebase-bom:')) {
      const depsIndex = content.indexOf('dependencies {');
      if (depsIndex !== -1) {
        const insertIndex = content.indexOf('}', depsIndex);
        content = content.slice(0, insertIndex) + 
                 '    // Firebase BoM\n' +
                 '    implementation platform("com.google.firebase:firebase-bom:32.0.0")\n' +
                 content.slice(insertIndex);
      }
    }
    
    fs.writeFileSync(buildGradlePath, content, 'utf8');
    console.log('Updated Android build.gradle');
  }
  
  const appBuildGradlePath = path.join(__dirname, '../android/app/build.gradle');
  if (fs.existsSync(appBuildGradlePath)) {
    let content = fs.readFileSync(appBuildGradlePath, 'utf8');
    
    // Fix multidex issue
    if (!content.includes('multiDexEnabled true')) {
      const defaultConfigIndex = content.indexOf('defaultConfig {');
      if (defaultConfigIndex !== -1) {
        const insertIndex = content.indexOf('}', defaultConfigIndex);
        content = content.slice(0, insertIndex) + 
                 '        multiDexEnabled true\n' +
                 content.slice(insertIndex);
      }
    }
    
    // Add Firebase dependencies
    if (!content.includes('apply plugin: "com.google.gms.google-services"')) {
      content += '\n// Apply Google Services plugin\napply plugin: "com.google.gms.google-services"\n';
    }
    
    fs.writeFileSync(appBuildGradlePath, content, 'utf8');
    console.log('Updated Android app/build.gradle');
  }
}

// Fix iOS CocoaPods UTF-8 encoding issue
function fixIOSCocoaPodsIssue() {
  console.log('Fixing iOS CocoaPods UTF-8 encoding issue...');
  
  const podfilePath = path.join(__dirname, '../ios/Podfile');
  if (fs.existsSync(podfilePath)) {
    let content = fs.readFileSync(podfilePath, 'utf8');
    
    // Add encoding fix
    if (!content.includes('ENV["COCOAPODS_DISABLE_STATS"]')) {
      content = '# Fix UTF-8 encoding issue\nENV["COCOAPODS_DISABLE_STATS"] = "true"\n' + content;
    }
    
    // Update deployment target
    content = content.replace(
      /platform :ios, '[\d.]+'/, 
      'platform :ios, \'12.0\''
    );
    
    // Add post install hooks for M1 Mac compatibility
    if (!content.includes('post_install do |installer|')) {
      content += `
# Post install hooks for M1 Mac compatibility
post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['EXCLUDED_ARCHS[sdk=iphonesimulator*]'] = 'arm64'
      config.build_settings["DEVELOPMENT_TEAM"] = "YOUR_TEAM_ID" # Replace with your team ID
      
      # Fix for iOS 12+ compatibility
      config.build_settings["IPHONEOS_DEPLOYMENT_TARGET"] = "12.0"
    end
  end
end
`;
    }
    
    fs.writeFileSync(podfilePath, content, 'utf8');
    console.log('Updated iOS Podfile');
  }
}

// Run the fixes
fixAndroidFirebaseIssues();
fixIOSCocoaPodsIssue();

console.log('Build issues fixed! You can now build the app for both Android and iOS.');
console.log('Note: You may need to run "cd ios && pod install" to apply the iOS fixes.');
