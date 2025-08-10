# Password Reset API Endpoints

This document describes the newly added password reset functionality for the WalkIn Drive App backend.

## New Endpoints

### 1. **POST /api/auth/forgot-password**

Initiates the password reset process by sending a reset email to the user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account with this email exists, you will receive password reset instructions."
}
```

**Status Codes:**
- `200` - Success (always returns success for security)
- `400` - Bad request (missing email)
- `500` - Server error

### 2. **POST /api/auth/reset-password**

Resets the user's password using the reset token from the email.

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "message": "Password has been successfully reset. You can now log in with your new password."
}
```

**Status Codes:**
- `200` - Password successfully reset
- `400` - Invalid/expired token or invalid password
- `500` - Server error

### 3. **GET /api/auth/verify-reset-token/:token**

Verifies if a reset token is valid (optional endpoint for frontend validation).

**Response:**
```json
{
  "valid": true,
  "message": "Token is valid",
  "email": "user@example.com"
}
```

## Database Changes

### User Model Updates

Added the following fields to the User schema:

```javascript
{
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

## Email Configuration

### Required Environment Variables

Add these to your `.env` file:

```env
# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup Instructions

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Use this password for `EMAIL_PASS`

### Email Template

The reset email includes:
- Professional HTML template
- Reset button with secure token
- Token expiration notice (1 hour)
- Security disclaimer

## Installation

### 1. Install New Dependencies

```bash
cd backend
npm install nodemailer
```

### 2. Update Environment Variables

```bash
cp .env.example .env
# Edit .env file with your email credentials
```

### 3. Restart Server

```bash
npm run dev
```

## Security Features

- **Token Expiration**: Reset tokens expire after 1 hour
- **Secure Token Generation**: Uses crypto.randomBytes(32)
- **Email Verification**: Only sends emails to existing accounts
- **Password Hashing**: New passwords are bcrypt hashed
- **Token Cleanup**: Expired/used tokens are automatically cleared
- **Rate Limiting**: Inherits from existing Express rate limiting

## Testing

### Manual Testing

1. **Test Forgot Password:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

2. **Test Reset Password:**
   ```bash
   curl -X POST http://localhost:5000/api/auth/reset-password \
     -H "Content-Type: application/json" \
     -d '{"token":"your-token","newPassword":"newpassword123"}'
   ```

### Email Testing

The backend includes email configuration testing. Check the console for:
- ✅ Email configuration is valid
- ❌ Email configuration error

## Frontend Integration

The mobile app is already configured to use these endpoints:

- **ForgotPasswordScreen** calls `/auth/forgot-password`
- **API service** includes `forgotPassword()` and `resetPassword()` methods
- **Error handling** for network issues and server errors

## Troubleshooting

### Common Issues

1. **Email not sending:**
   - Check EMAIL_USER and EMAIL_PASS in .env
   - Verify Gmail app password is correct
   - Check console for email configuration errors

2. **Token expired:**
   - Reset tokens expire after 1 hour
   - User needs to request a new reset email

3. **Server errors:**
   - Check MongoDB connection
   - Verify all environment variables are set
   - Check server logs for detailed error messages

### Production Considerations

- Use environment-specific FRONTEND_URL
- Consider using professional email service (SendGrid, AWS SES)
- Implement additional rate limiting for password reset endpoints
- Add monitoring for failed email attempts
- Consider SMS-based reset as alternative