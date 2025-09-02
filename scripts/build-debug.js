const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Starting debug build process...');

// Check environment variables
console.log('\n📋 Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_DEV_BASE_URL:', process.env.NEXT_PUBLIC_DEV_BASE_URL);

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
  console.log('✅ .env file found');
} else {
  console.log('❌ .env file not found');
}

// Check package.json
const packagePath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packagePath)) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('\n📦 Package Info:');
  console.log('Name:', packageJson.name);
  console.log('Version:', packageJson.version);
  console.log('Next.js Version:', packageJson.dependencies?.next);
}

// Check Next.js config
const nextConfigPath = path.join(process.cwd(), 'next.config.js');
if (fs.existsSync(nextConfigPath)) {
  console.log('\n⚙️ Next.js config found');
} else {
  console.log('\n❌ Next.js config not found');
}

// Try to run build with verbose output
console.log('\n🚀 Starting build process...');
try {
  const buildOutput = execSync('npm run build', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('✅ Build completed successfully!');
  console.log(buildOutput);
} catch (error) {
  console.error('❌ Build failed!');
  console.error('Error:', error.message);
  if (error.stdout) {
    console.error('Stdout:', error.stdout);
  }
  if (error.stderr) {
    console.error('Stderr:', error.stderr);
  }
  process.exit(1);
} 