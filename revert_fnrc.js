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
      walk(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.html') || filePath.endsWith('.json')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const files = walk(path.join(__dirname, 'src'));

let replacedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('Prime Organization')) {
    let newContent = content.replace(/Prime Organization/g, 'FNRC');

    if (newContent !== content) {
      fs.writeFileSync(file, newContent, 'utf8');
      replacedCount++;
      console.log(`Updated ${file}`);
    }
  }
}

console.log(`Replaced Prime Organization with FNRC in ${replacedCount} files.`);
