/**
 * Script to create required assets for the app
 */

const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const ensureDirectoryExists = (dirPath) => {
  if (!dirPath || dirPath === '') return;
  
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
  }
};

// Create placeholder assets
const createPlaceholderAssets = () => {
  const assetsDir = path.join(process.cwd(), 'assets');
  ensureDirectoryExists(assetsDir);
  
  // Create a placeholder app icon
  const appIconSvg = `<svg width="1024" height="1024" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1024" height="1024" fill="#2196F3"/>
  <path d="M512 256C406.98 256 322 340.98 322 446C322 551.02 406.98 636 512 636C617.02 636 702 551.02 702 446C702 340.98 617.02 256 512 256ZM512 576C440.65 576 382 517.35 382 446C382 374.65 440.65 316 512 316C583.35 316 642 374.65 642 446C642 517.35 583.35 576 512 576Z" fill="white"/>
  <path d="M512 636C406.98 636 322 720.98 322 826H382C382 754.65 440.65 696 512 696C583.35 696 642 754.65 642 826H702C702 720.98 617.02 636 512 636Z" fill="white"/>
  <path d="M512 256C617.02 256 702 171.02 702 66H642C642 137.35 583.35 196 512 196C440.65 196 382 137.35 382 66H322C322 171.02 406.98 256 512 256Z" fill="white"/>
  <path d="M702 446C702 340.98 617.02 256 512 256V316C583.35 316 642 374.65 642 446C642 517.35 583.35 576 512 576V636C617.02 636 702 551.02 702 446Z" fill="white"/>
  <path d="M322 446C322 551.02 406.98 636 512 636V576C440.65 576 382 517.35 382 446C382 374.65 440.65 316 512 316V256C406.98 256 322 340.98 322 446Z" fill="white"/>
</svg>`;

  fs.writeFileSync(path.join(assetsDir, 'app_icon.svg'), appIconSvg, 'utf8');
  console.log('Created app_icon.svg');
  
  // Create a PNG version (this is just a placeholder, in a real app you would use a proper conversion tool)
  fs.writeFileSync(path.join(assetsDir, 'app_icon.png'), 'PNG PLACEHOLDER', 'utf8');
  console.log('Created app_icon.png');
  
  // Create a placeholder splash screen
  const splashScreenSvg = `<svg width="1242" height="2688" viewBox="0 0 1242 2688" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1242" height="2688" fill="#2196F3"/>
  <path d="M621 1244C515.98 1244 431 1328.98 431 1434C431 1539.02 515.98 1624 621 1624C726.02 1624 811 1539.02 811 1434C811 1328.98 726.02 1244 621 1244ZM621 1564C549.65 1564 491 1505.35 491 1434C491 1362.65 549.65 1304 621 1304C692.35 1304 751 1362.65 751 1434C751 1505.35 692.35 1564 621 1564Z" fill="white"/>
  <path d="M621 1624C515.98 1624 431 1708.98 431 1814H491C491 1742.65 549.65 1684 621 1684C692.35 1684 751 1742.65 751 1814H811C811 1708.98 726.02 1624 621 1624Z" fill="white"/>
  <path d="M621 1244C726.02 1244 811 1159.02 811 1054H751C751 1125.35 692.35 1184 621 1184C549.65 1184 491 1125.35 491 1054H431C431 1159.02 515.98 1244 621 1244Z" fill="white"/>
  <text x="621" y="1900" font-family="Arial" font-size="120" text-anchor="middle" fill="white">QuickAudit</text>
</svg>`;

  fs.writeFileSync(path.join(assetsDir, 'splash_screen.svg'), splashScreenSvg, 'utf8');
  console.log('Created splash_screen.svg');
  
  // Create a PNG version (this is just a placeholder, in a real app you would use a proper conversion tool)
  fs.writeFileSync(path.join(assetsDir, 'splash_screen.png'), 'PNG PLACEHOLDER', 'utf8');
  console.log('Created splash_screen.png');
  
  // Create a placeholder logo
  const logoSvg = `<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M256 0C114.84 0 0 114.84 0 256C0 397.16 114.84 512 256 512C397.16 512 512 397.16 512 256C512 114.84 397.16 0 256 0ZM256 470.4C137.83 470.4 41.6 374.17 41.6 256C41.6 137.83 137.83 41.6 256 41.6C374.17 41.6 470.4 137.83 470.4 256C470.4 374.17 374.17 470.4 256 470.4Z" fill="#2196F3"/>
  <path d="M256 128C203.49 128 161 170.49 161 223C161 275.51 203.49 318 256 318C308.51 318 351 275.51 351 223C351 170.49 308.51 128 256 128ZM256 288C220.32 288 191 258.68 191 223C191 187.32 220.32 158 256 158C291.68 158 321 187.32 321 223C321 258.68 291.68 288 256 288Z" fill="#2196F3"/>
  <path d="M256 318C203.49 318 161 360.49 161 413H191C191 377.32 220.32 348 256 348C291.68 348 321 377.32 321 413H351C351 360.49 308.51 318 256 318Z" fill="#2196F3"/>
  <path d="M256 128C308.51 128 351 85.51 351 33H321C321 68.68 291.68 98 256 98C220.32 98 191 68.68 191 33H161C161 85.51 203.49 128 256 128Z" fill="#2196F3"/>
</svg>`;

  fs.writeFileSync(path.join(assetsDir, 'logo.svg'), logoSvg, 'utf8');
  console.log('Created logo.svg');
  
  // Create a PNG version (this is just a placeholder, in a real app you would use a proper conversion tool)
  fs.writeFileSync(path.join(assetsDir, 'logo.png'), 'PNG PLACEHOLDER', 'utf8');
  console.log('Created logo.png');
  
  // Create a placeholder logo for use in the app
  fs.writeFileSync(path.join(assetsDir, 'logo-placeholder.png'), 'PNG PLACEHOLDER', 'utf8');
  console.log('Created logo-placeholder.png');
};

// Run the function
console.log('Creating required assets...');
createPlaceholderAssets();
console.log('Assets created successfully!');
