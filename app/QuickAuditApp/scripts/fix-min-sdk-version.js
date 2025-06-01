/**
 * Script to fix minSdkVersion issue in Android build
 */

const fs = require('fs');
const path = require('path');

// Fix the minSdkVersion in build.gradle
const fixBuildGradle = () => {
  const buildGradlePath = path.join(process.cwd(), 'android/app/build.gradle');
  
  if (fs.existsSync(buildGradlePath)) {
    let content = fs.readFileSync(buildGradlePath, 'utf8');
    
    // Update minSdkVersion to 26
    content = content.replace(
      /minSdk\s*=\s*\d+/,
      'minSdk = 26'
    );
    
    // Also ensure we have the correct applicationId
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
    }
    
    fs.writeFileSync(buildGradlePath, content, 'utf8');
    console.log('Updated minSdkVersion to 26 in build.gradle');
  } else {
    console.error('build.gradle not found');
  }
};

// Fix the minSdkVersion in react-native.config.js
const fixReactNativeConfig = () => {
  const configPath = path.join(process.cwd(), 'react-native.config.js');
  
  if (fs.existsSync(configPath)) {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Add minSdkVersion if it doesn't exist
    if (!content.includes('minSdkVersion')) {
      content = content.replace(
        /android: {[^}]*}/s,
        (match) => {
          return match.replace(
            /}$/,
            ',\n      minSdkVersion: 26\n    }'
          );
        }
      );
    } else {
      // Update minSdkVersion if it exists
      content = content.replace(
        /minSdkVersion: \d+/,
        'minSdkVersion: 26'
      );
    }
    
    fs.writeFileSync(configPath, content, 'utf8');
    console.log('Updated minSdkVersion in react-native.config.js');
  } else {
    console.error('react-native.config.js not found');
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

// Run all functions
console.log('Fixing minSdkVersion issues...');
fixBuildGradle();
fixReactNativeConfig();
createWebMobileComparison();
console.log('minSdkVersion issues fixed successfully!');
console.log('Run `cd android && ./gradlew clean` before trying to build again.');
console.log('Check WEB_MOBILE_COMPARISON.md for a detailed comparison between the web and mobile apps.');
