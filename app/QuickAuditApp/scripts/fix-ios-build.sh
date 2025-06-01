#!/bin/bash
# Script to fix common iOS build issues

echo "Fixing iOS build issues..."

# Navigate to iOS directory
cd ios

# Clean derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clean build folder
xcodebuild clean

# Install pods with repo update
pod install --repo-update

echo "iOS build environment prepared successfully!"
