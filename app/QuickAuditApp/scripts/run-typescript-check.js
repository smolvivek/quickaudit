/**
 * Script to run a TypeScript check on the entire codebase
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('Running TypeScript check...');

try {
  // Run TypeScript check
  const result = execSync('npx tsc --noEmit', { 
    cwd: process.cwd(),
    stdio: 'pipe',
    encoding: 'utf-8'
  });
  
  console.log('TypeScript check passed! No errors found.');
} catch (error) {
  console.error('TypeScript check failed with errors:');
  console.error(error.stdout);
  process.exit(1);
}
