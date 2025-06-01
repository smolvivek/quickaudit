/**
 * Script to fix TypeScript errors in service files
 * This script specifically targets service files that have complex TypeScript errors
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all service TypeScript files
const serviceFiles = glob.sync(path.join(__dirname, '../src/services/**/*.ts'));

// Common type fixes for service files
const serviceFixes = [
  // Fix interface property errors (TS1131)
  { 
    from: /(\w+):\s*([^;\n]+)(?=[;\n])/g, 
    to: (match, prop, type) => {
      if (type.includes('{') || type.includes('(')) return match;
      return `${prop}: ${type};`;
    }
  },
  // Fix missing semicolons (TS1005)
  { 
    from: /(\w+\s*=\s*[^;{]+)(?=\n)/g, 
    to: '$1;' 
  },
  // Fix argument expressions (TS1135)
  { 
    from: /\(([^)]*)\)\s*=>\s*{/g, 
    to: (match, params) => {
      if (!params.trim()) return '() => {';
      return match;
    }
  },
  // Fix expression expected errors (TS1109)
  { 
    from: /}\s*else\s*{/g, 
    to: '} else {' 
  },
  // Fix declaration errors (TS1128)
  { 
    from: /}\s*(\w+)/g, 
    to: '}\n$1' 
  },
  // Fix missing interface properties
  {
    from: /interface\s+(\w+)\s*{([^}]*)}/g,
    to: (match, name, props) => {
      if (!props.trim().endsWith(';')) {
        return `interface ${name} {${props};}`;
      }
      return match;
    }
  },
  // Fix ApiService specific errors
  {
    from: /export\s+class\s+ApiService\s*{([^}]*)}/gs,
    to: (match, content) => {
      const fixedContent = content
        .replace(/(\w+):/g, '$1:')
        .replace(/(\w+)\s*\(/g, '$1(')
        .replace(/\)\s*{/g, ') {')
        .replace(/(\w+)\s*=\s*([^;]+)(?!\s*;)/g, '$1 = $2;');
      return `export class ApiService {${fixedContent}}`;
    }
  },
  // Fix mockBackend specific errors
  {
    from: /export\s+const\s+mockBackend\s*=\s*{([^}]*)}/gs,
    to: (match, content) => {
      const fixedContent = content
        .replace(/(\w+):\s*async\s*\(/g, '$1: async(')
        .replace(/\)\s*=>\s*{/g, ') => {')
        .replace(/(\w+)\s*:\s*([^,;{}]+)(?!\s*[,;])/g, '$1: $2,');
      return `export const mockBackend = {${fixedContent}}`;
    }
  }
];

// Process each service file
serviceFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    // Apply fixes
    serviceFixes.forEach(fix => {
      const newContent = content.replace(fix.from, fix.to);
      if (newContent !== content) {
        content = newContent;
        modified = true;
      }
    });
    
    // Save changes if modified
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Fixed TypeScript errors in ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Service TypeScript errors fixed!');
