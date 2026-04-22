const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'src');
const iconImportPattern = /import\s+\{[^}]*\}\s+from\s+['"]react-icons\/([a-z0-9]+)['"]/g;

const iconUsage = {};

function scanDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      scanDir(filePath);
    } else if (/\.(js|jsx|ts|tsx)$/.test(file)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      let match;
      while ((match = iconImportPattern.exec(content)) !== null) {
        const iconSet = match[1];
        if (!iconUsage[iconSet]) iconUsage[iconSet] = [];
        iconUsage[iconSet].push(filePath);
      }
    }
  });
}

scanDir(baseDir);

// Print summary
console.log('React Icons Usage Summary:\n');
for (const [iconSet, files] of Object.entries(iconUsage)) {
  console.log(`Icon Set: ${iconSet}`);
  files.forEach(f => console.log(`  - ${f}`));
  console.log('-----------------------------------');
}

// Save to JSON
fs.writeFileSync('react_icons_usage_report.json', JSON.stringify(iconUsage, null, 2));
console.log('\n✅ Report saved to react_icons_usage_report.json');