# SendGrid Email Integration for MoringaPair

This document explains how to set up and use the SendGrid email service in MoringaPair.

## Overview

The MoringaPair application now supports sending email notifications via **SendGrid**. This enables:
- ✉️ Pairing announcements
- 📝 Feedback notifications
- ✅ Pairing completion confirmations
- 📌 Assessment reminders

## Setup Instructions

### 1. Get a SendGrid Account

1. Sign up for a free SendGrid account at [https://sendgrid.com/free](https://sendgrid.com/free)
2. Create an API key:
   - Log in to SendGrid Dashboard
   - Go to **Settings > API Keys**
   - Click **Create API Key**
   - Choose **Full Access** or **Restricted Access** (recommended for production)
   - Copy the API key

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory with:

```env
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=noreply@moringapair.com
```

Example:
```env
SENDGRID_API_KEY=SG.abc123def456...
SENDGRID_FROM_EMAIL=noreply@moringapair.com
FLASK_ENV=development
DATABASE_URL=sqlite:///instance/moringapair.db
JWT_SECRET_KEY=your_jwt_secret_here
```

### 3. Verify Sender Email

Before sending emails in production:
1. Go to SendGrid Dashboard
2. Navigate to **Settings > Sender Authentication**
3. Verify your sender email domain

## API Endpoints

### Send Pairing Notification Email

**POST** `/api/notifications/send-pairing-email`

Request body:
```json
{
  "partner_name": "John Doe",
  "cohort": "SE-Cohort 34",
  "week": "6",
  "focus": "React Hooks"
}
```

Response:
```json
{
  "success": true,
  "message": "Pairing notification email sent"
}
```

---

### Send Feedback Notification Email

**POST** `/api/notifications/send-feedback-email`

Request body:
```json
{
  "mentor_name": "Albert Byrone",
  "feedback_summary": "Great progress on component design! Keep practicing state management."
}
```

Response:
```json
{
  "success": true,
  "message": "Feedback notification email sent"
}
```

---

### Send Pairing Completion Email

**POST** `/api/notifications/send-pairing-complete-email`

Request body:
```json
{
  "partner_name": "Jane Smith"
}
```

Response:
```json
{
  "success": true,
  "message": "Pairing completion email sent"
}
```

---

### Send Assessment Reminder Email

**POST** `/api/notifications/send-assessment-reminder-email`

Request body:
```json
{
  "assessment_name": "React Quiz",
  "due_date": "2026-09-10"
}
```

Response:
```json
{
  "success": true,
  "message": "Assessment reminder email sent"
}
```

## Usage Example

```python
from services.email_service import EmailService

# Send pairing notification
result = EmailService.send_pairing_notification(
    to_email="student@example.com",
    user_name="Alice",
    partner_name="Bob",
    cohort="SE-34",
    week="6",
    focus="React Hooks"
)

if result["success"]:
    print("Email sent successfully!")
else:
    print(f"Error: {result['error']}")
```

## Frontend Integration

### Example: Send Email After Pairing Creation

```javascript
const handlePairingCreated = async (pairingData) => {
  const response = await fetch('/api/notifications/send-pairing-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      partner_name: pairingData.partner.name,
      cohort: pairingData.cohort.name,
      week: pairingData.week,
      focus: pairingData.focus
    })
  });

  const result = await response.json();
  if (result.success) {
    showNotification('Pairing email sent successfully!');
  }
};
```

## Troubleshooting

### "SendGrid API key not configured"
- Ensure `.env` file exists in the `backend/` directory
- Check that `SENDGRID_API_KEY` is set correctly
- Make sure `run.py` is using `load_dotenv()` to load environment variables

### "Failed to send email"
- Verify your SendGrid API key is valid
- Check that your sender email is verified in SendGrid
- Ensure the recipient email address is valid

### Email not received
- Check SendGrid Activity Feed for delivery status
- Verify email isn't in spam folder
- Check recipient email address is correct

## Free Tier Limits

SendGrid's free tier includes:
- **100 emails/day** (every day)
- Full access to all features
- Great for development and testing

Upgrade to a paid plan for higher limits:
- Pro: 100,000+ emails/month
- Enterprise: Custom limits

## Environment Variables Reference

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `SENDGRID_API_KEY` | Your SendGrid API key | Yes | `SG.abc123...` |
| `SENDGRID_FROM_EMAIL` | Sender email address | Yes | `noreply@moringapair.com` |
| `FLASK_ENV` | Flask environment | No | `development` |
| `DATABASE_URL` | Database connection URL | No | `sqlite:///instance/moringapair.db` |
| `JWT_SECRET_KEY` | JWT secret for auth | Yes | `your-secret-key` |

## Security Best Practices

1. **Never commit `.env` file** - Add to `.gitignore`
2. **Use restricted API keys** - SendGrid allows restricting API key permissions
3. **Rotate API keys regularly** - Update keys every 90 days
4. **Monitor email usage** - Check SendGrid dashboard for unusual activity
5. **Validate email addresses** - Use email validation before sending

## Support

For issues with SendGrid integration:
1. Check SendGrid documentation: [https://docs.sendgrid.com/](https://docs.sendgrid.com/)
2. Review error messages in application logs
3. Test API key validity in SendGrid dashboard

## Next Steps

- Integrate email sending into pairing workflow
- Add email templates for customization
- Set up email bounce handling
- Implement email unsubscribe functionality
- Create admin dashboard for email analytics
