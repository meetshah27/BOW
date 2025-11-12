const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Starting Lambda deployment package creation...\n');

// Configuration
const DEPLOY_DIR = path.join(__dirname, 'lambda-deploy');
const ZIP_FILE = path.join(__dirname, 'bow-backend-lambda.zip');

// Files/directories to exclude
const EXCLUDE_PATTERNS = [
  'node_modules',
  'amplify',
  'lambda-deploy',
  '.git',
  '.env',
  '*.md',
  '*.txt',
  'test-*.js',
  'check-*.js',
  'cleanup-*.js',
  'create-*.js',
  'seed-*.js',
  'migrate-*.js',
  'setup-*.js',
  'update-*.js',
  'verify-*.js',
  'monitor-*.js',
  'start*.js',
  'bin',
  '.gitignore',
  'lambda-index.js', // Use lambda.js instead
];

// Clean up previous deployment
if (fs.existsSync(DEPLOY_DIR)) {
  console.log('🧹 Cleaning up previous deployment directory...');
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}

if (fs.existsSync(ZIP_FILE)) {
  console.log('🧹 Removing old zip file...');
  fs.unlinkSync(ZIP_FILE);
}

// Create deployment directory
fs.mkdirSync(DEPLOY_DIR, { recursive: true });
console.log('✅ Created deployment directory\n');

// Function to check if file should be excluded
function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(__dirname, filePath);
  
  return EXCLUDE_PATTERNS.some(pattern => {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(fileName) || regex.test(relativePath);
    }
    return fileName === pattern || relativePath.includes(pattern);
  });
}

// Function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(src)) return;
  
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (shouldExclude(srcPath)) {
      continue;
    }
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ✓ Copied: ${path.relative(__dirname, srcPath)}`);
    }
  }
}

// Copy necessary files and directories
console.log('📋 Copying files...');
const filesToCopy = [
  'server.js',
  'lambda.js', // Lambda handler
  'package.json',
  'package-lock.json',
];

for (const file of filesToCopy) {
  const srcPath = path.join(__dirname, file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(DEPLOY_DIR, file));
    console.log(`  ✓ Copied: ${file}`);
  }
}

// Copy directories
const dirsToCopy = [
  'routes',
  'middleware',
  'models-dynamodb',
  'config',
  'utils',
  'public',
];

for (const dir of dirsToCopy) {
  const srcPath = path.join(__dirname, dir);
  if (fs.existsSync(srcPath)) {
    const destPath = path.join(DEPLOY_DIR, dir);
        fs.mkdirSync(destPath, { recursive: true });
        copyDirectory(srcPath, destPath);
  }
}

console.log('\n📦 Installing production dependencies...');
try {
  process.chdir(DEPLOY_DIR);
  execSync('npm ci --production --silent', { stdio: 'inherit' });
  console.log('✅ Production dependencies installed\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Check package size
console.log('📊 Checking package size...');
const getDirectorySize = (dirPath) => {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalSize += getDirectorySize(filePath);
    } else {
      totalSize += stat.size;
    }
  }
  
  return totalSize;
};

const sizeInMB = (getDirectorySize(DEPLOY_DIR) / (1024 * 1024)).toFixed(2);
console.log(`📦 Package size: ${sizeInMB} MB\n`);

if (parseFloat(sizeInMB) > 50) {
  console.log('⚠️  WARNING: Package size exceeds 50MB (Lambda direct upload limit)');
  console.log('💡 Consider using Lambda Layers or S3 upload for deployment\n');
}

// Create zip file
console.log('🗜️  Creating zip file...');
try {
  // Use PowerShell on Windows to create zip
  const zipCommand = `Compress-Archive -Path "${DEPLOY_DIR}\\*" -DestinationPath "${ZIP_FILE}" -Force`;
  execSync(`powershell -Command "${zipCommand}"`, { stdio: 'inherit' });
  
  const zipSize = (fs.statSync(ZIP_FILE).size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Zip file created: ${ZIP_FILE}`);
  console.log(`📦 Zip size: ${zipSize} MB\n`);
} catch (error) {
  console.error('❌ Error creating zip file:', error.message);
  console.log('💡 You can manually zip the contents of:', DEPLOY_DIR);
  process.exit(1);
}

console.log('🎉 Deployment package created successfully!\n');
console.log('📝 Next steps:');
console.log('   1. Upload the zip file to AWS Lambda:');
console.log(`      ${ZIP_FILE}`);
console.log('   2. Set the handler to: lambda.handler');
console.log('   3. Configure environment variables in Lambda console');
console.log('   4. Set up API Gateway or Function URL for HTTP access\n');
