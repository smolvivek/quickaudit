const { execSync } = require('child_process');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 QuickAudit Simulator Launcher');
console.log('===============================');
console.log('This script will help you launch the QuickAudit app on iOS and Android simulators.');
console.log('');

// Function to launch iOS simulator
function launchIOS() {
  console.log('🍎 Launching iOS simulator...');
  try {
    // Kill Metro bundler if running
    try {
      execSync('pkill -f "metro"', { stdio: 'ignore' });
    } catch (e) {
      // Ignore errors if Metro isn't running
    }
    
    // Start Expo with iOS simulator
    execSync('npx expo start --ios --port 8086', { 
      stdio: 'inherit',
      env: { ...process.env, EXPO_DEBUG: '1' }
    });
  } catch (error) {
    console.error('❌ Error launching iOS simulator:', error.message);
    console.log('Try running manually: cd /Users/vivekmangipudi/Desktop/QuickAudit/app/QuickAuditExpo && npx expo start --ios --port 8086');
  }
}

// Function to launch Android simulator
function launchAndroid() {
  console.log('🤖 Launching Android simulator...');
  try {
    // Kill Metro bundler if running
    try {
      execSync('pkill -f "metro"', { stdio: 'ignore' });
    } catch (e) {
      // Ignore errors if Metro isn't running
    }
    
    // Start Expo with Android simulator
    execSync('npx expo start --android --port 8087', { 
      stdio: 'inherit',
      env: { ...process.env, EXPO_DEBUG: '1' }
    });
  } catch (error) {
    console.error('❌ Error launching Android simulator:', error.message);
    console.log('Try running manually: cd /Users/vivekmangipudi/Desktop/QuickAudit/app/QuickAuditExpo && npx expo start --android --port 8087');
  }
}

// Function to launch web browser
function launchWeb() {
  console.log('🌐 Launching in web browser...');
  try {
    // Kill Metro bundler if running
    try {
      execSync('pkill -f "metro"', { stdio: 'ignore' });
    } catch (e) {
      // Ignore errors if Metro isn't running
    }
    
    // Start Expo with web
    execSync('npx expo start --web --port 8088', { 
      stdio: 'inherit',
      env: { ...process.env, EXPO_DEBUG: '1' }
    });
  } catch (error) {
    console.error('❌ Error launching web version:', error.message);
    console.log('Try running manually: cd /Users/vivekmangipudi/Desktop/QuickAudit/app/QuickAuditExpo && npx expo start --web --port 8088');
  }
}

// Ask user which platform to launch
console.log('Select a platform to launch:');
console.log('1. iOS Simulator');
console.log('2. Android Simulator');
console.log('3. Web Browser');
console.log('4. Exit');

rl.question('Enter your choice (1-4): ', (answer) => {
  switch(answer.trim()) {
    case '1':
      launchIOS();
      break;
    case '2':
      launchAndroid();
      break;
    case '3':
      launchWeb();
      break;
    case '4':
      console.log('Exiting...');
      break;
    default:
      console.log('Invalid choice. Exiting...');
  }
  
  rl.close();
});
