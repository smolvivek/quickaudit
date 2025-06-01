/**
 * Screenshot Generator for QuickAudit App
 * 
 * This script helps generate screenshots of key screens in the QuickAudit app
 * for presentations, documentation, and marketing materials.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Create screenshots directory if it doesn't exist
const screenshotsDir = path.join(__dirname, '..', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
  console.log('Created screenshots directory');
}

// Key screens to capture
const screens = [
  {
    name: 'Login',
    route: 'Login',
    description: 'The login screen allows users to authenticate with their credentials.'
  },
  {
    name: 'Dashboard',
    route: 'Dashboard',
    description: 'The main dashboard showing an overview of audits and tasks.'
  },
  {
    name: 'AuditList',
    route: 'AuditList',
    description: 'List of all audits with filtering and sorting options.'
  },
  {
    name: 'AuditForm',
    route: 'AuditForm',
    description: 'The audit form screen where users can fill out audit questionnaires.'
  },
  {
    name: 'AuditReport',
    route: 'AuditReport',
    description: 'Detailed audit report with findings and recommendations.'
  },
  {
    name: 'ReportSummary',
    route: 'ReportSummary',
    description: 'Summary of audit reports with key metrics and scores.'
  }
];

// Create a JSON manifest of the screenshots
const manifest = {
  appName: 'QuickAudit',
  version: '1.0.0',
  generatedAt: new Date().toISOString(),
  screens: screens.map(screen => ({
    ...screen,
    filename: `${screen.name.toLowerCase()}.png`,
    path: `screenshots/${screen.name.toLowerCase()}.png`
  }))
};

// Write the manifest file
fs.writeFileSync(
  path.join(screenshotsDir, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Screenshot manifest created');
console.log('');
console.log('To capture screenshots:');
console.log('1. Run the app on a simulator or device');
console.log('2. Navigate to each screen');
console.log('3. Use the device\'s screenshot functionality');
console.log('4. Save the screenshots to the "screenshots" directory');
console.log('');
console.log('Screens to capture:');
screens.forEach(screen => {
  console.log(`- ${screen.name}: ${screen.description}`);
});

// Create an HTML preview of the screenshots (placeholder for now)
const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>QuickAudit Screenshots</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    h1 {
      color: #2E7D32;
      text-align: center;
      margin-bottom: 30px;
    }
    .screenshot-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }
    .screenshot-card {
      background-color: white;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .screenshot-placeholder {
      height: 500px;
      background-color: #ddd;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
    }
    .screenshot-info {
      padding: 15px;
    }
    .screenshot-name {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .screenshot-description {
      color: #555;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <h1>QuickAudit App Screenshots</h1>
  
  <div class="screenshot-grid">
    ${screens.map(screen => `
      <div class="screenshot-card">
        <div class="screenshot-placeholder">
          ${screen.name} Screenshot Placeholder
        </div>
        <div class="screenshot-info">
          <div class="screenshot-name">${screen.name}</div>
          <div class="screenshot-description">${screen.description}</div>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
`;

fs.writeFileSync(
  path.join(screenshotsDir, 'preview.html'),
  htmlTemplate
);

console.log('');
console.log('Created HTML preview at screenshots/preview.html');
