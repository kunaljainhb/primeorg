const fs = require('fs');
const { execSync } = require('child_process');

try {
  // Move the file
  if (fs.existsSync('prime-logo.png')) {
    fs.renameSync('prime-logo.png', 'public/prime-logo.png');
    console.log('✅ Successfully moved prime-logo.png to the public folder.');
  } else if (fs.existsSync('public/prime-logo.png')) {
    console.log('✅ The logo is already in the public folder.');
  } else {
    console.log('❌ Could not find prime-logo.png anywhere!');
  }

  // Add to git
  execSync('git add public/prime-logo.png', { stdio: 'inherit' });
  console.log('✅ Successfully added to Git!');
  
  // Commit
  execSync('git commit -m "Fix logo path for Vercel"', { stdio: 'inherit' });
  console.log('✅ Successfully committed!');
  
  // Push
  execSync('git push', { stdio: 'inherit' });
  console.log('✅ Successfully pushed to Vercel!');

} catch (error) {
  console.error('Error:', error.message);
}
