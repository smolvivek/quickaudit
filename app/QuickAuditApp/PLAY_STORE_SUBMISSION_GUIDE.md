# QuickAudit App - Play Store Submission Guide

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
   ```bash
   keytool -genkeypair -v -storetype PKCS12 -keystore android/app/release-key.keystore -alias release-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Update `android/gradle.properties` with keystore details:
   ```
   MYAPP_RELEASE_STORE_FILE=release-key.keystore
   MYAPP_RELEASE_KEY_ALIAS=release-key-alias
   MYAPP_RELEASE_STORE_PASSWORD=*****
   MYAPP_RELEASE_KEY_PASSWORD=*****
   ```

3. Update `android/app/build.gradle` to include signing config:
   ```groovy
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
   ```

### Building the App Bundle
1. Generate the release AAB:
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

2. The AAB will be at:
   `android/app/build/outputs/bundle/release/app-release.aab`

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

Remember to keep your signing key secure - if you lose it, you won't be able to update your app!