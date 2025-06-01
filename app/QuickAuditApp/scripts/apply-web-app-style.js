/**
 * Script to rapidly apply web app styling to all screens
 * This script will:
 * 1. Update imports to include the web app theme
 * 2. Replace old color references with theme colors
 * 3. Apply consistent styling to components
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all screen files
const screenFiles = glob.sync(path.join(__dirname, '../src/screens/**/*.{js,tsx}'));

// Import statements to add
const importsToAdd = `import {theme as appTheme} from '../../theme/ThemeProvider';
import {cardStyles, buttonStyles} from '../../theme/webAppTheme';`;

// Color replacements
const colorReplacements = [
  { from: /colors\.primary/g, to: 'appTheme.colors.primary' },
  { from: /colors\.secondary/g, to: 'appTheme.colors.secondary' },
  { from: /colors\.success/g, to: 'appTheme.colors.primary' },
  { from: /colors\.warning/g, to: 'appTheme.colors.warning || "#FFC107"' },
  { from: /colors\.error/g, to: 'appTheme.colors.error' },
  { from: /colors\.info/g, to: 'appTheme.colors.primary' },
  { from: /colors\.surface/g, to: 'appTheme.colors.surface' },
  { from: /colors\.background/g, to: 'appTheme.colors.background' },
  { from: /colors\.grey\[(\d+)\]/g, to: (match, p1) => `'#${getGrayHexCode(p1)}'` },
];

// Style replacements
const styleReplacements = [
  { from: /container: {[^}]+}/g, to: 'container: {...cardStyles.container}' },
  { from: /button: {[^}]+}/g, to: 'button: {...buttonStyles.button}' },
  { from: /buttonText: {[^}]+}/g, to: 'buttonText: {...buttonStyles.text}' },
];

// Helper function to get gray hex codes
function getGrayHexCode(level) {
  const map = {
    '50': 'FAFAFA',
    '100': 'F5F5F5',
    '200': 'EEEEEE',
    '300': 'E0E0E0',
    '400': 'BDBDBD',
    '500': '9E9E9E',
    '600': '757575',
    '700': '616161',
    '800': '424242',
    '900': '212121',
  };
  return map[level] || '9E9E9E';
}

// Process each file
screenFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  
  // Add imports if they don't exist
  if (!content.includes('theme as appTheme') && !content.includes('webAppTheme')) {
    const importIndex = content.lastIndexOf('import');
    const importEndIndex = content.indexOf(';', importIndex) + 1;
    content = content.slice(0, importEndIndex) + '\n' + importsToAdd + content.slice(importEndIndex);
  }
  
  // Apply color replacements
  colorReplacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Apply style replacements
  styleReplacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Convert JS to TSX if needed
  if (file.endsWith('.js')) {
    const tsxFile = file.replace('.js', '.tsx');
    console.log(`Converting ${file} to ${tsxFile}`);
    
    // Add TypeScript types
    content = content.replace(/function\s+(\w+)\s*\(\s*props\s*\)/g, 'function $1(props: any)');
    content = content.replace(/const\s+(\w+)\s*=\s*\(\s*props\s*\)\s*=>/g, 'const $1 = (props: any) =>');
    content = content.replace(/const\s+(\w+)\s*=\s*\(\s*\{\s*([^}]*)\s*\}\s*\)\s*=>/g, 'const $1 = ({ $2 }: any) =>');
    
    // Write to new TSX file
    fs.writeFileSync(tsxFile, content, 'utf8');
  } else {
    // Write back to the same file
    fs.writeFileSync(file, content, 'utf8');
  }
});

console.log('Web app styling applied to all screens!');
