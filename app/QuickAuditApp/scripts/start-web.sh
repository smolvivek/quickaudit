#!/bin/bash
# Script to start the web version of QuickAudit

echo "Starting QuickAudit Web Version..."

# Navigate to the project directory
cd "$(dirname "$0")/.."

# Check if webpack is installed
if ! command -v webpack &> /dev/null; then
  echo "Installing webpack..."
  npm install --save-dev webpack webpack-cli webpack-dev-server babel-loader url-loader
fi

# Start the web server
echo "Starting webpack dev server..."
npx webpack serve --mode development --open

echo "Web server started. If browser doesn't open automatically, visit http://localhost:8080"