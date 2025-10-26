const noisePatterns = [
  /\.log$/, /\.tmp$/, /\.bak$/, /\.swp$/, /\.pwc$/,
  /\.DS_Store$/, /Thumbs\.db$/,
  /^\.vscode$/, /^\.idea$/, /^\.pytest_cache$/, /^coverage$/,
    /^__pycache__$/, /^node_modules$/
];

const fs = require('fs');
const path = require('path');

function findNoiseFiles(dir = '.') {
    let flagged = [];

    function walk(currentPath) {
        const entries = fs.readdirSync(currentPath, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);

            for (const pattern of noisePatterns) {
                if (pattern.test(entry.name)) {
                    flagged.push(fullPath);
                    break;
                }
            }

            if (entry.isDirectory()) {
                walk(fullPath);
            }
        }
    }

    walk(dir);
    return flagged;
}

let output = '';
const noiseFiles = findNoiseFiles();
if (noiseFiles.length > 0) {
    console.log('⚠️ Found potentially superfluous files/directories:');
    for (const file of noiseFiles) {
        output+=(`- \`${file}\`\n`);
    }
    output+=('\n🧹 Consider removing them if they are not needed.');
} else {
    output+=('✅ No noise detected.');
}

fs.writeFileSync('noise.txt', output);