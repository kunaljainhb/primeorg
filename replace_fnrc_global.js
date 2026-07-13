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
      if (!filePath.includes('node_modules') && !filePath.includes('.git') && !filePath.includes('dist')) {
        walk(filePath, fileList);
      }
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.html') || filePath.endsWith('.css') || filePath.endsWith('.json')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = walk(__dirname);

let fileCount = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;
  
  newContent = newContent.replace(/fnrc\.gov\.ae/gi, 'prime.org');
  newContent = newContent.replace(/FNRC/g, 'Prime');
  newContent = newContent.replace(/fnrc/g, 'prime');
  newContent = newContent.replace(/Fnrc/g, 'Prime');

  if (newContent !== content) {
    fs.writeFileSync(file, newContent, 'utf8');
    fileCount++;
    console.log(`Updated ${path.basename(file)}`);
  }
}

console.log(`\nSuccess! Updated ${fileCount} files.`);
