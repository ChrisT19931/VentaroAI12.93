# 📧 Email System Setup Instructions

## 🚨 Current Status: EMAIL SYSTEM READY BUT NEEDS API KEYS

Your email system is **fully built and functional**, but emails are not being sent because the API keys in `.env.local` are placeholders.

## 🔧 Quick Fix (Choose One Option)

### Option 1: Brevo (Recommended - Free tier available)

1. **Get Brevo API Key:**
   - Go to: https://app.brevo.com/settings/keys/api
   - Sign up/login to Brevo (formerly Sendinblue)
   - Create new API key with "Send emails" permission
   - Copy the key (starts with `xkeysib-`)

2. **Update .env.local:**
   ```bash
   # Replace this line:
   BREVO_API_KEY=xkeysib-a0348dc3d4b321e7c8f9d2e1b5a6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8
   
   # With your real key:
   BREVO_API_KEY=xkeysib-YOUR_REAL_API_KEY_HERE
   ```

3. **Verify sender email:**
   - In Brevo dashboard, verify `chris.t@ventarosales.com`
   - Or update `BREVO_FROM_EMAIL` in `.env.local` to a verified email

### Option 2: SendGrid (Alternative)

1. **Get SendGrid API Key:**
   - Go to: https://app.sendgrid.com/settings/api_keys
   - Sign up/login to SendGrid
   - Create new API key with "Mail Send" permission
   - Copy the key (starts with `SG.`)

2. **Update .env.local:**
   ```bash
   # Replace this line:
   SENDGRID_API_KEY=SG.placeholder_get_real_key_from_sendgrid
   
   # With your real key:
   SENDGRID_API_KEY=SG.YOUR_REAL_API_KEY_HERE
   ```

3. **Verify sender email:**
   - In SendGrid dashboard, verify `chris.t@ventarosales.com`
   - Or update `SENDGRID_FROM_EMAIL` in `.env.local` to a verified email

## 🧪 Test Email System

After setting up API keys, run:

```bash
# Test email configuration
node setup-real-email-config.js

# Test all forms with email integration
node test-questionnaire-form.js
```

## 📧 What Emails Will Be Sent

Once configured, the system will send:

### Contact/Questionnaire Form:
- **To User (christroiano1993@gmail.com):** Confirmation email
- **To Admin (chris.t@ventarosales.com):** Notification with form details

### Newsletter Subscription:
- **To User:** Welcome email
- **To Admin:** New subscriber notification

### Subscription Interest:
- **To User:** Interest confirmation
- **To Admin:** New interest notification

## 🎨 Email Templates

The system includes dynamic email templates with:
- Professional HTML formatting
- Company branding (Ventaro AI)
- All form data included in admin notifications
- User-friendly confirmation messages
- Responsive design for mobile/desktop

## 🔍 Verification Steps

1. **Set up API key** (Brevo or SendGrid)
2. **Run test script:** `node setup-real-email-config.js`
3. **Check inbox:** christroiano1993@gmail.com
4. **Verify templates** look professional
5. **Confirm receipt** of test emails
6. **Test all forms** with `node test-questionnaire-form.js`

## 🚀 Ready for Production

Once emails are working:
- ✅ All forms have email integration
- ✅ Professional email templates
- ✅ Admin notifications working
- ✅ User confirmations working
- ✅ Fallback system (Brevo → SendGrid → Database backup)
- ✅ Rate limiting and spam protection
- ✅ Email logging and monitoring

## 🔧 Troubleshooting

### "API key not configured" error:
- Check `.env.local` has real API key (not placeholder)
- Restart development server: `npm run dev`

### "Sender email not verified" error:
- Verify sender email in your email service dashboard
- Update `BREVO_FROM_EMAIL` or `SENDGRID_FROM_EMAIL` to verified address

### Emails go to spam:
- Set up domain authentication in email service
- Use verified domain email address
- Add SPF/DKIM records to domain

## 📞 Support

If you need help:
1. Run diagnostic: `node setup-real-email-config.js`
2. Check server logs for detailed errors
3. Verify API key permissions in email service dashboard
4. Test with simple email first before complex forms

---

**Next Step:** Set up your API key and run the test script to send actual emails to christroiano1993@gmail.com!