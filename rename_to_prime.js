import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      // Exclude node_modules, .git, dist
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
        walk(filePath, fileList);
      }
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.html') || filePath.endsWith('.css')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = walk(path.join(__dirname, 'src'));
files.push(path.join(__dirname, 'index.html'));

let replacedCount = 0;
let fileCount = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('FNRC')) {
    // Replace uppercase FNRC with Prime Organization
    let newContent = content.replace(/FNRC/g, 'Prime Organization');

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      fileCount++;
      replacedCount += (content.match(/FNRC/g) || []).length;
      console.log(`Updated ${path.basename(file)}`);
    }
  }
}

console.log(`\nSuccess! Replaced ${replacedCount} instances of 'FNRC' across ${fileCount} files.`);
