#!/bin/bash
# Script to fix common Android build issues

echo "Fixing Android build issues..."

# Navigate to Android directory
cd android

# Clean build
./gradlew clean

# Fix gradle permissions
chmod +x gradlew

# Create local.properties if it doesn't exist
if [ ! -f local.properties ]; then
  echo "Creating local.properties file..."
  echo "sdk.dir=$HOME/Library/Android/sdk" > local.properties
fi

echo "Android build environment prepared successfully!"
