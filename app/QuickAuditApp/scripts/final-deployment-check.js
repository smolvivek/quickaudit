/**
 * Final Deployment Check Script for QuickAudit App
 * 
 * This script performs a final check of the codebase to ensure it's ready for deployment:
 * 1. Runs TypeScript checks on all files
 * 2. Verifies all screens are properly implemented
 * 3. Checks for any missing assets or configurations
 * 4. Generates app store metadata and screenshots
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Helper to log with colors
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  section: (msg) => console.log(`\n${colors.cyan}=== ${msg} ===${colors.reset}`)
};

// Run TypeScript check
const runTypeScriptCheck = () => {
  log.section('Running TypeScript Check');
  
  try {
    log.info('Executing TypeScript compiler...');
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
    log.success('TypeScript check passed!');
    return true;
  } catch (error) {
    log.error('TypeScript check failed. Please fix the errors above before proceeding.');
    return false;
  }
};

// Verify all screens are implemented
const verifyScreens = () => {
  log.section('Verifying Screen Implementation');
  
  const requiredScreens = [
    // Auth screens
    'src/screens/auth/LoginScreen.tsx',
    'src/screens/auth/SignupScreen.tsx',
    'src/screens/auth/ForgotPasswordScreen.tsx',
    
    // Main screens
    'src/screens/HomeScreen.tsx',
    'src/screens/ProfileScreen.tsx',
    
    // Field auditor screens
    'src/screens/field_auditor/DashboardScreen.tsx',
    'src/screens/field_auditor/AuditListScreen.tsx',
    'src/screens/field_auditor/AuditEditScreen.tsx',
    'src/screens/field_auditor/AuditExecutionScreen.tsx',
    'src/screens/field_auditor/ReportSummaryScreen.tsx',
    'src/screens/FindingDetails.tsx',
    
    // Legal screens
    'src/screens/legal/TermsScreen.tsx',
    'src/screens/legal/PrivacyPolicyScreen.tsx',
    'src/screens/legal/RefundPolicyScreen.tsx',
    'src/screens/legal/AboutUsScreen.tsx',
    'src/screens/legal/ContactUsScreen.tsx',
    
    // Subscription screens
    'src/screens/subscription/SubscriptionScreen.tsx',
    'src/screens/subscription/SubscriptionDetailsScreen.tsx',
    'src/screens/subscription/PaymentMethodScreen.tsx'
  ];
  
  let missingScreens = [];
  
  for (const screen of requiredScreens) {
    const screenPath = path.join(process.cwd(), screen);
    if (!fs.existsSync(screenPath)) {
      missingScreens.push(screen);
    }
  }
  
  if (missingScreens.length > 0) {
    log.error('The following screens are missing:');
    missingScreens.forEach(screen => console.log(`  - ${screen}`));
    return false;
  }
  
  log.success('All required screens are implemented!');
  return true;
};

// Check for missing assets
const checkAssets = () => {
  log.section('Checking Required Assets');
  
  const requiredAssets = [
    // App icons
    'android/app/src/main/res/mipmap-hdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-mdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png',
    'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png',
    'ios/QuickAuditApp/Images.xcassets/AppIcon.appiconset/Contents.json',
    
    // Splash screen
    'android/app/src/main/res/drawable/splash_screen.xml',
    'ios/QuickAuditApp/Images.xcassets/SplashScreen.imageset/Contents.json',
    
    // Configuration files
    'android/app/build.gradle',
    'ios/Podfile',
    'package.json',
    'tsconfig.json'
  ];
  
  let missingAssets = [];
  
  for (const asset of requiredAssets) {
    const assetPath = path.join(process.cwd(), asset);
    if (!fs.existsSync(assetPath)) {
      missingAssets.push(asset);
    }
  }
  
  if (missingAssets.length > 0) {
    log.error('The following assets are missing:');
    missingAssets.forEach(asset => console.log(`  - ${asset}`));
    return false;
  }
  
  log.success('All required assets are present!');
  return true;
};

// Generate app store metadata
const generateAppStoreMetadata = () => {
  log.section('Generating App Store Metadata');
  
  const metadataDir = path.join(process.cwd(), 'app_store_metadata');
  if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
    fs.mkdirSync(path.join(metadataDir, 'ios'));
    fs.mkdirSync(path.join(metadataDir, 'android'));
  }
  
  // App Store description
  const appDescription = `QuickAudit - Mobile Audit Management

QuickAudit is a comprehensive mobile audit management solution designed for field auditors and quality assurance professionals. Streamline your audit processes, increase efficiency, and improve compliance with our intuitive mobile app.

Key Features:
• Create and customize audit templates for various inspection types
• Conduct audits offline with automatic sync when connectivity is restored
• Capture photos and notes directly within audit items
• Generate professional PDF reports with just one tap
• Track audit history and compliance trends over time
• Secure cloud storage for all audit data
• Role-based access control for team management

Whether you're conducting safety inspections, quality audits, or compliance checks, QuickAudit simplifies the entire process from start to finish.

Download QuickAudit today and transform your audit management workflow!`;

  // Keywords
  const keywords = 'audit,inspection,compliance,quality,safety,checklist,field service,mobile forms,reporting,quality assurance';
  
  // Write iOS metadata
  fs.writeFileSync(path.join(metadataDir, 'ios', 'description.txt'), appDescription);
  fs.writeFileSync(path.join(metadataDir, 'ios', 'keywords.txt'), keywords);
  fs.writeFileSync(path.join(metadataDir, 'ios', 'support_url.txt'), 'https://quickaudit.com/support');
  fs.writeFileSync(path.join(metadataDir, 'ios', 'marketing_url.txt'), 'https://quickaudit.com');
  fs.writeFileSync(path.join(metadataDir, 'ios', 'privacy_url.txt'), 'https://quickaudit.com/privacy');
  
  // Write Android metadata
  fs.writeFileSync(path.join(metadataDir, 'android', 'full_description.txt'), appDescription);
  fs.writeFileSync(path.join(metadataDir, 'android', 'short_description.txt'), 'Mobile audit management solution for field auditors and QA professionals.');
  fs.writeFileSync(path.join(metadataDir, 'android', 'title.txt'), 'QuickAudit - Audit Management');
  
  log.success('App store metadata generated successfully!');
  log.info(`Metadata files saved to: ${metadataDir}`);
  
  return true;
};

// Create a checklist for manual verification
const createManualChecklist = () => {
  log.section('Creating Manual Verification Checklist');
  
  const checklistContent = `# QuickAudit App - Pre-submission Checklist

## Functionality Testing
- [ ] Login/Signup flow works correctly
- [ ] Password reset functionality works
- [ ] All navigation flows are working as expected
- [ ] Audit creation process works end-to-end
- [ ] Audit execution process works end-to-end
- [ ] Photo capture and attachment works
- [ ] Report generation works correctly
- [ ] Offline functionality works as expected
- [ ] Subscription management works correctly
- [ ] Payment processing works correctly

## UI/UX Testing
- [ ] All screens render correctly on different device sizes
- [ ] Dark/light mode switching works correctly (if applicable)
- [ ] No UI elements are cut off or improperly aligned
- [ ] Loading states are properly indicated
- [ ] Error messages are clear and helpful
- [ ] Animations and transitions are smooth

## Platform-specific Testing
### iOS
- [ ] App works on iPhone (all supported sizes)
- [ ] App works on iPad (if supported)
- [ ] App adheres to iOS Human Interface Guidelines
- [ ] No issues with iOS permissions

### Android
- [ ] App works on various Android phone sizes
- [ ] App works on Android tablets (if supported)
- [ ] App adheres to Material Design guidelines
- [ ] No issues with Android permissions

## Performance Testing
- [ ] App startup time is reasonable
- [ ] No memory leaks during extended use
- [ ] Battery usage is reasonable
- [ ] App performs well on older devices

## Security Testing
- [ ] User data is properly encrypted
- [ ] Authentication tokens are securely stored
- [ ] API calls use HTTPS
- [ ] No sensitive information is logged

## App Store Requirements
- [ ] Privacy policy is accessible
- [ ] Terms of service are accessible
- [ ] All required app store screenshots are created
- [ ] App icon displays correctly
- [ ] App description and keywords are optimized

## Final Steps
- [ ] Version number is correct
- [ ] Build number is incremented
- [ ] All test accounts/data are removed from production build
- [ ] Analytics tracking is properly implemented
- [ ] Crash reporting is properly implemented
`;

  fs.writeFileSync(path.join(process.cwd(), 'PRE_SUBMISSION_CHECKLIST.md'), checklistContent);
  
  log.success('Manual verification checklist created!');
  log.info('Checklist saved to: PRE_SUBMISSION_CHECKLIST.md');
  
  return true;
};

// Main function to run all checks
const runAllChecks = () => {
  log.section('QUICKAUDIT APP - FINAL DEPLOYMENT CHECK');
  
  let allPassed = true;
  
  // Run all checks
  allPassed = runTypeScriptCheck() && allPassed;
  allPassed = verifyScreens() && allPassed;
  allPassed = checkAssets() && allPassed;
  allPassed = generateAppStoreMetadata() && allPassed;
  allPassed = createManualChecklist() && allPassed;
  
  // Final result
  log.section('FINAL RESULT');
  
  if (allPassed) {
    log.success('All automated checks passed! The app is ready for final manual testing before submission.');
    log.info('Please complete the manual verification checklist (PRE_SUBMISSION_CHECKLIST.md) before submitting to app stores.');
    log.info('Refer to DEPLOYMENT_GUIDE.md for detailed submission instructions.');
  } else {
    log.error('Some checks failed. Please address the issues before proceeding with app submission.');
    log.info('Once all issues are fixed, run this script again to verify.');
  }
};

// Run the checks
runAllChecks();
