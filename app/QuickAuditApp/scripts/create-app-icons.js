/**
 * Script to create app icons for Android
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Create a simple app icon with the QuickAudit logo
const createIcon = (size, outputPath) => {
  // Create a canvas with the specified size
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Fill the background with the primary color
  ctx.fillStyle = '#4CAF50'; // Green color for QuickAudit
  ctx.fillRect(0, 0, size, size);
  
  // Add a circle in the center
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size * 0.4, 0, Math.PI * 2);
  ctx.fill();
  
  // Add a checkmark in the center
  ctx.fillStyle = '#4CAF50';
  ctx.font = `bold ${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✓', size / 2, size / 2);
  
  // Save the icon to the output path
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  console.log(`Created icon at ${outputPath}`);
};

// Create icons for different densities
const createAppIcons = () => {
  // Define icon sizes for different densities
  const iconSizes = {
    'mdpi': 48,
    'hdpi': 72,
    'xhdpi': 96,
    'xxhdpi': 144,
    'xxxhdpi': 192
  };
  
  // Create mipmap directories if they don't exist
  Object.keys(iconSizes).forEach(density => {
    const dir = path.join(process.cwd(), `android/app/src/main/res/mipmap-${density}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
    
    // Create regular and round icons
    const iconPath = path.join(dir, 'ic_launcher.png');
    const roundIconPath = path.join(dir, 'ic_launcher_round.png');
    
    createIcon(iconSizes[density], iconPath);
    createIcon(iconSizes[density], roundIconPath); // For simplicity, using the same icon for round
  });
  
  // Create a high-res icon for Play Store
  const playStoreDir = path.join(process.cwd(), 'android/app/src/main/play_store');
  if (!fs.existsSync(playStoreDir)) {
    fs.mkdirSync(playStoreDir, { recursive: true });
    console.log(`Created directory: ${playStoreDir}`);
  }
  
  const playStoreIconPath = path.join(playStoreDir, 'app_icon.png');
  createIcon(512, playStoreIconPath);
  
  console.log('All app icons created successfully!');
};

// Try to run the function, but handle the case where canvas is not installed
try {
  createAppIcons();
} catch (error) {
  console.error('Error creating app icons:', error.message);
  console.log('\nTo create app icons, you need to install the canvas package:');
  console.log('npm install canvas');
  console.log('\nAlternatively, you can manually create app icons using an image editor and place them in the appropriate mipmap directories.');
}
