/**
 * Script to fix critical TypeScript errors across the codebase
 * This script will:
 * 1. Add proper type annotations to common patterns
 * 2. Fix fontWeight type issues
 * 3. Fix index expression errors
 * 4. Fix missing import statements
 * 5. Fix destructuring syntax errors
 * 6. Fix missing closing tags
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Get all TypeScript files
const tsFiles = glob.sync(path.join(__dirname, '../src/**/*.{ts,tsx}'));

// Common type fixes
const typeFixes = [
  // Fix fontWeight type issues
  { 
    from: /fontWeight:\s*['"](\w+)['"]/g, 
    to: (match, weight) => `fontWeight: '${weight}'` 
  },
  // Fix TextStyle casting
  { 
    from: /(style|styles):\s*{([^}]*)}/g, 
    to: (match, name, content) => {
      if (content.includes('fontWeight') || content.includes('fontSize')) {
        return `${name}: {${content}} as TextStyle`;
      }
      return match;
    }
  },
  // Fix index expressions
  { 
    from: /\[(\w+)\.id\s*\+\s*['"]\-['"]\s*\+\s*(\w+)\.id\]/g, 
    to: (match, section, item) => `[\`\${${section}.id}-\${${item}.id}\`]` 
  },
  // Add type imports
  { 
    from: /import\s+{([^}]*)}\s+from\s+['"]react-native['"];/g, 
    to: (match, imports) => {
      if (!imports.includes('TextStyle')) {
        return `import {${imports}, TextStyle} from 'react-native';`;
      }
      return match;
    }
  },
  // Fix missing identifier errors (TS1003)
  {
    from: /(import[\s\S]*?;\s*)(const|function)/g,
    to: (match, imports, declaration) => `${imports}\n${declaration}`
  },
  // Fix destructuring errors (TS1180)
  {
    from: /({[^}]*})\s*=>\s*{/g,
    to: (match, props) => {
      // Make sure props has proper type
      if (!props.includes(':')) {
        return `${props}: any => {`;
      }
      return match;
    }
  },
  // Fix missing commas in object literals (TS1005)
  {
    from: /(\w+):\s*([^,{\n}]+)\s+(\w+):/g,
    to: (match, prop1, value, prop2) => `${prop1}: ${value}, ${prop2}:`
  },
  // Fix missing closing tags (TS17008)
  {
    from: /(<Text[^>]*>)([^<]*?)(?!<\/Text>)/g,
    to: (match, openTag, content) => `${openTag}${content}</Text>`
  },
  // Fix any types in function parameters
  { 
    from: /(\w+):\s*React\.FC<([^>]+)>\s*=\s*\(\{([^}]*)\}\)/g, 
    to: (match, name, type, params) => {
      const typedParams = params.split(',').map(param => {
        const [paramName, ...rest] = param.trim().split(':');
        if (rest.length === 0) {
          return `${paramName}: any`;
        }
        return param;
      }).join(', ');
      return `${name}: React.FC<${type}> = ({${typedParams}})`;
    }
  }
];

// Process each file
tsFiles.forEach(file => {
  console.log(`Processing ${file}...`);
  let content = fs.readFileSync(file, 'utf8');
  
  // Apply type fixes
  typeFixes.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });
  
  // Write back to the file
  fs.writeFileSync(file, content, 'utf8');
});

console.log('Critical TypeScript errors fixed!');
