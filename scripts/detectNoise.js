const fs = require('node:fs');
const path = require('node:path');

// File extension patterns - AI-generated files that shouldn't be in main
const filePatterns = [
  /\.log$/, /\.tmp$/, /\.bak$/, /\.swp$/, 
  /debug\./i, /test-output/i, /\.orig$/,
  /scratch\./i, /temp\./i, /\.draft$/,
  /\.checkpoint$/, /\.autosave$/,
  /untitled/i, /new-file/i,
  /\.DS_Store$/, /Thumbs\.db$/,
  /\.pyc$/, /\.pyo$/
];

// Directory/path patterns - AI-generated artifacts and dev-only folders
const dirPatterns = [
  /^\.vscode[\\/]/, /^\.idea[\\/]/, /^\.pytest_cache[\\/]/, 
  /^coverage[\\/]/, /^__pycache__[\\/]/, /^node_modules[\\/]/,
  /^tmp[\\/]/, /^temp[\\/]/, /^dist[\\/]/, /^build[\\/]/,
  /^scratch[\\/]/, /^debug[\\/]/, /^experiments[\\/]/,
  /^\.cache[\\/]/, /^\.next[\\/]/, /^\.nuxt[\\/]/,
  /^out[\\/]/, /^output[\\/]/
];

function isNoiseFile(filePath) {
  const normalized = path.posix.normalize(filePath);
  return filePatterns.some(pattern => pattern.test(normalized)) ||
         dirPatterns.some(pattern => pattern.test(normalized));
}

function detectNoiseFiles(files, ignore = []) {
  return files.filter(file => {
    if (ignore.includes(file)) return false;
    return isNoiseFile(file);
  });
}

function findNoiseFiles(dir = '.') {
    let flagged = [];

    function walk(currentPath) {
        const entries = fs.readdirSync(currentPath, {withFileTypes: true});

        for (const entry of entries) {
            const fullPath = path.join(currentPath, entry.name);
            const relativePath = path.relative('.', fullPath);

            if (isNoiseFile(relativePath)) {
                flagged.push(fullPath);
            }

            if (entry.isDirectory() && !isNoiseFile(relativePath)) {
                walk(fullPath);
            }
        }
    }

    walk(dir);
    return flagged;
}


function formatNoiseOutput(noiseFiles) {
    if (noiseFiles.length > 0) {
        let output = '⚠️ Found ' + noiseFiles.length + ' potentially superfluous files:\n';
        for (const file of noiseFiles) {
            output += `- ${file}\n`;
        }
        output += '\n🧹 Consider removing them if they are not needed.';
        return output;
    } else {
        return '✅ No noise detected.';
    }
}

const noiseFiles = findNoiseFiles();
const output = formatNoiseOutput(noiseFiles);
if (noiseFiles.length > 0) {
    console.log('⚠️ Found potentially superfluous files/directories:');
}
fs.writeFileSync('noise.txt', output);

module.exports = { findNoiseFiles, formatNoiseOutput, detectNoiseFiles };