#!/bin/bash
# Script to prepare the QuickAudit app for final deployment

echo "Preparing QuickAudit app for final deployment..."

# Fix remaining TypeScript errors
./scripts/fix-typescript.sh

# Prepare iOS build
echo "Preparing iOS build..."
cd ios
pod install
cd ..

# Prepare Android build
echo "Preparing Android build..."
cd android
./gradlew clean
cd ..

echo "QuickAudit app is now ready for deployment!"
echo "Follow the instructions in DEPLOYMENT_GUIDE.md to submit to the App Store and Play Store."
