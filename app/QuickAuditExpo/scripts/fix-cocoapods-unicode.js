const fs = require('fs');
const path = require('path');

// Path to the CocoaPods config file
const cocoaPodsConfigPath = '/opt/homebrew/Cellar/cocoapods/1.16.2_1/libexec/gems/cocoapods-1.16.2/lib/cocoapods/config.rb';

// Check if the file exists
if (fs.existsSync(cocoaPodsConfigPath)) {
  console.log('Found CocoaPods config file. Applying fix...');
  
  // Read the file content
  let content = fs.readFileSync(cocoaPodsConfigPath, 'utf8');
  
  // Replace the problematic line with a fixed version
  content = content.replace(
    /def installation_root.*?end/s,
    `def installation_root
      @installation_root ||= begin
        path = @installation_root_override || Dir.pwd
        path = path.force_encoding('UTF-8') if path.respond_to?(:force_encoding)
        path
      end
    end`
  );
  
  // Write the modified content back to the file
  fs.writeFileSync(cocoaPodsConfigPath + '.backup', fs.readFileSync(cocoaPodsConfigPath));
  fs.writeFileSync(cocoaPodsConfigPath, content);
  
  console.log('Fix applied successfully! A backup of the original file was created at ' + cocoaPodsConfigPath + '.backup');
} else {
  console.error('CocoaPods config file not found at the expected location. You may need to adjust the path.');
}
