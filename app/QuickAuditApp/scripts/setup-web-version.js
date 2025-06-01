/**
 * Script to set up the web version of QuickAudit app
 * This will allow testing the app in a browser while native builds are being fixed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Install required dependencies
const installDependencies = () => {
  try {
    console.log('Installing React Native Web dependencies...');
    execSync('npm install --save react-dom react-native-web', { stdio: 'inherit' });
    console.log('Dependencies installed successfully.');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
  }
};

// Create web entry point
const createWebEntryPoint = () => {
  const indexPath = path.join(process.cwd(), 'index.js');
  const webIndexPath = path.join(process.cwd(), 'index.web.js');
  
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, webIndexPath);
    console.log('Created index.web.js entry point.');
  } else {
    console.error('index.js not found. Cannot create web entry point.');
  }
};

// Create webpack config for web
const createWebpackConfig = () => {
  const content = `const path = require('path');
const webpack = require('webpack');

const appDirectory = path.resolve(__dirname, '.');

// This is needed for webpack to compile JavaScript.
// Many OSS React Native packages are not compiled to ES5 before being
// published to npm. If you depend on uncompiled packages they may cause webpack build
// errors. To fix this webpack can be configured to compile to the necessary \`node_module\`.
const babelLoaderConfiguration = {
  test: /\\.js$|tsx?$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(appDirectory, 'index.web.js'),
    path.resolve(appDirectory, 'App.js'),
    path.resolve(appDirectory, 'src'),
    // Specific node_modules that need to be transpiled
    path.resolve(appDirectory, 'node_modules/react-native-uncompiled'),
  ],
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      // The 'metro-react-native-babel-preset' preset is recommended to match React Native's packager
      presets: ['module:metro-react-native-babel-preset'],
      // Re-write paths to import only the modules needed by the app
      plugins: ['react-native-web'],
    },
  },
};

// This is needed for webpack to import static images in JavaScript files.
const imageLoaderConfiguration = {
  test: /\\.(gif|jpe?g|png|svg)$/,
  use: {
    loader: 'url-loader',
    options: {
      name: '[name].[ext]',
      esModule: false,
    },
  },
};

module.exports = {
  entry: {
    app: path.join(appDirectory, 'index.web.js'),
  },
  output: {
    path: path.resolve(appDirectory, 'dist'),
    publicPath: '/',
    filename: 'bundle.web.js',
  },
  resolve: {
    // This will only alias the exact import "react-native"
    alias: {
      'react-native$': 'react-native-web',
    },
    // If you're working on a multi-platform React Native app, web-specific
    // module implementations should be written in files using the extension
    // '.web.js'.
    extensions: ['.web.js', '.js', '.tsx', '.ts'],
  },
  module: {
    rules: [babelLoaderConfiguration, imageLoaderConfiguration],
  },
  plugins: [
    // process.env.NODE_ENV should be defined for React Native
    new webpack.DefinePlugin({
      process: { env: {} },
    }),
  ],
};`;

  fs.writeFileSync('webpack.config.js', content, 'utf8');
  console.log('Created webpack.config.js');
};

// Create HTML template
const createHtmlTemplate = () => {
  const content = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickAudit</title>
  <style>
    html, body, #root {
      height: 100%;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    #root {
      display: flex;
      flex-direction: column;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  <script src="/bundle.web.js"></script>
</body>
</html>`;

  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  fs.writeFileSync('public/index.html', content, 'utf8');
  console.log('Created public/index.html');
};

// Create web start script
const createWebStartScript = () => {
  const content = `#!/bin/bash
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

echo "Web server started. If browser doesn't open automatically, visit http://localhost:8080"`;

  const scriptPath = path.join(process.cwd(), 'scripts/start-web.sh');
  fs.writeFileSync(scriptPath, content, 'utf8');
  fs.chmodSync(scriptPath, '755');
  console.log('Created start-web.sh script');
};

// Update package.json with web scripts
const updatePackageJson = () => {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    let packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add web scripts
    packageJson.scripts = {
      ...packageJson.scripts,
      'web': 'webpack serve --mode development --open',
      'build-web': 'webpack --mode production'
    };
    
    // Add devDependencies if they don't exist
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      'webpack': '^5.88.2',
      'webpack-cli': '^5.1.4',
      'webpack-dev-server': '^4.15.1',
      'babel-loader': '^9.1.3',
      'url-loader': '^4.1.1'
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
    console.log('Updated package.json with web scripts');
  } else {
    console.error('package.json not found');
  }
};

// Run all functions
console.log('Setting up QuickAudit Web Version...');
installDependencies();
createWebEntryPoint();
createWebpackConfig();
createHtmlTemplate();
createWebStartScript();
updatePackageJson();
console.log('\nQuickAudit Web Version setup complete!');
console.log('To start the web version, run: ./scripts/start-web.sh');
console.log('Or use: npm run web');
console.log('\nThis will allow you to test the app in a browser while we continue working on the native build issues.');
