import { execSync } from 'child_process';
import fs from 'fs';
try {
  const result = execSync('git log -p -n 5', { encoding: 'utf8' });
  fs.writeFileSync('log_output.txt', result);
} catch (e) {
  fs.writeFileSync('log_output.txt', e.message);
}
