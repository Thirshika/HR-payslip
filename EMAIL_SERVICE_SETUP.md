# Email Service Setup Guide

## Current Issue
Your Brevo SMTP account is **not activated**. You're getting a 403 error:
```
"Unable to send email. Your SMTP account is not yet activated. Please contact us at contact@brevo.com to request activation"
```

## How to Fix

### Option 1: Activate Brevo SMTP (Recommended if you want to use Brevo)

1. Go to [Brevo.com](https://www.brevo.com)
2. Login to your account
3. Go to **Settings** > **SMTP & API**
4. Look for the **SMTP section**
5. Click **"Request SMTP Access"** or similar button
6. Wait for Brevo to activate your SMTP (usually takes 24 hours)
7. Once activated, you'll see your SMTP credentials:
   - SMTP Server: `smtp-relay.brevo.com`
   - Port: `587`
   - Username: Your Brevo login email
   - Password: Your Brevo API key (or a specific SMTP password)

8. Update your `.env` file:
```env
EMAIL_PROVIDER=brevo
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-brevo-api-key
BREVO_API_KEY=your-brevo-api-key
EMAIL_FROM=your-email@example.com
EMAIL_FROM_NAME=HR Department
```

### Option 2: Switch to Gmail SMTP (Quick Alternative)

If you want to send emails immediately without waiting for Brevo activation:

1. Go to [Gmail Account Settings](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Generate an **App Password** (not your Gmail password)
4. Update your `.env` file:
```env
EMAIL_PROVIDER=smtp
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_FROM=your-gmail@gmail.com
EMAIL_FROM_NAME=HR Department
```

### Option 3: Use SendGrid (Most Reliable)

1. Sign up at [SendGrid.com](https://sendgrid.com)
2. Get your API key from **Settings** > **API Keys**
3. Update your `.env` file:
```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=your-email@example.com
EMAIL_FROM_NAME=HR Department
```

## Environment Variables Reference

```env
# Email Provider (options: smtp, brevo, sendgrid)
EMAIL_PROVIDER=brevo

# SMTP Settings
EMAIL_HOST=smtp-relay.brevo.com
EMAIL_PORT=587
EMAIL_SECURE=false  # Use true for port 465, false for 587/25
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-password-or-api-key

# Email Configuration
EMAIL_FROM=your-email@example.com
EMAIL_FROM_NAME=HR Department
EMAIL_REPLY_TO=hr@example.com

# Provider-specific API Keys
BREVO_API_KEY=your-brevo-key
SENDGRID_API_KEY=SG.your-sendgrid-key
```

## Testing the Configuration

After updating `.env`, restart your backend:

```bash
# Kill the current process (Ctrl+C)
# Then run:
uvicorn main:app --host 0.0.0.0 --port 8000
```

Go to the "Test Payslip Email" section in HR Admin and click "Email" button. You should now see:
- ✓ **Success message** in green (email sent)
- ✕ **Error message** in red (with clear description)

## Troubleshooting

### "Email sent successfully" appears but email doesn't arrive
- Check spam/junk folder
- Verify recipient email address is correct
- Check if domain has SPF/DKIM records configured

### Still getting 403 error
- Brevo SMTP is still not activated (can take 24 hours)
- Contact Brevo support at contact@brevo.com
- Switch to Gmail or SendGrid in the meantime

### Connection timeout errors
- Check if firewall is blocking SMTP port (587 or 465)
- On Render.com, SMTP might be blocked - use SendGrid API instead

## Frontend Improvements (Recently Added)

- Error messages now display in a highlighted box instead of plain text
- JSON error responses are automatically parsed and formatted
- Success/failure messages show with appropriate icons (✓/✕)
- Error messages are word-wrapped so long text doesn't overflow

---

**Next Steps:**
1. Choose which email provider to use (Brevo, Gmail, or SendGrid)
2. Update your `.env` file with the credentials
3. Restart the backend server
4. Test the email functionality
