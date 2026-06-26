import { execSync } from 'child_process';
import fs from 'fs';
try {
  const result = execSync('git status && git branch', { encoding: 'utf8' });
  fs.writeFileSync('git_info.txt', result);
} catch (e) {
  fs.writeFileSync('git_info.txt', e.message);
}
