# Gmail Setup Guide for AyurChakra Backend

## Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click "2-Step Verification"
4. Follow the prompts to enable 2FA

## Step 2: Generate App Password
1. Go to Google Account settings: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Under "Signing in to Google", click "App passwords"
4. Select "Mail" as the app
5. Select "Other (custom name)" as the device
6. Enter "AyurChakra Backend" as the name
7. Click "Generate"
8. Copy the 16-character password (it will look like: abcd efgh ijkl mnop)

## Step 3: Update .env File
Replace these lines in your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-actual-gmail@gmail.com
EMAIL_REPLY_TO=your-actual-gmail@gmail.com
FRONTEND_URL=http://localhost:3000
```

## Step 4: Test Email Service
After updating the .env file, restart your server and test the email service.

## Alternative: Use a Different Email Provider
If you prefer not to use Gmail, you can use:
- Outlook/Hotmail: smtp-mail.outlook.com, port 587
- Yahoo: smtp.mail.yahoo.com, port 587
- Custom SMTP server

## Security Note
- Never commit your actual email credentials to version control
- Use environment variables for all sensitive data
- The .env file is already in .gitignore
