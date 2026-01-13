# Mailtrap Integration Guide

## Overview

This guide explains what's needed to integrate Mailtrap for sending OTP emails and other notifications.

---

## What You Need

### 1. Mailtrap Account & Setup

**Required**:
- ✅ Mailtrap account (sign up at https://mailtrap.io)
- ✅ Verify sending domain (or use Mailtrap test domain for development)
- ✅ API Token or SMTP credentials

**Steps**:
1. Sign up for Mailtrap account
2. Go to **Sending Domains** → Add/verify your domain (or use test domain)
3. Go to **Integrations** → Choose integration method:
   - **Option A**: API Integration (recommended for production)
   - **Option B**: SMTP Integration (simpler, works well with nodemailer)

---

### 2. Integration Method Options

#### Option A: Mailtrap API (Recommended)

**Pros**:
- ✅ Direct API calls (fast, reliable)
- ✅ Better for production
- ✅ More control over email sending
- ✅ Better error handling

**Cons**:
- ❌ Requires HTTP client setup
- ❌ Slightly more complex

**What You Need**:
- Mailtrap API Token
- HTTP client (axios/fetch)
- API endpoint: `https://send.api.mailtrap.io/api/send`

#### Option B: SMTP via Nodemailer (Simpler)

**Pros**:
- ✅ Simple to set up
- ✅ Works with standard SMTP libraries
- ✅ Good for development/testing

**Cons**:
- ❌ Slightly slower (SMTP protocol overhead)
- ❌ Less control over sending

**What You Need**:
- SMTP credentials from Mailtrap
- `nodemailer` package
- SMTP configuration

---

### 3. Required Packages

#### For API Integration:
```bash
# Already available (axios not installed yet, but fetch is available in Bun)
# Option: Install axios if preferred
bun add axios
```

#### For SMTP Integration:
```bash
# Install nodemailer
bun add nodemailer
bun add -d @types/nodemailer
```

---

### 4. Environment Variables

**Already configured** in `.env.example`:
```env
# Mailtrap
MAILTRAP_API_TOKEN=your-mailtrap-api-token
MAILTRAP_FROM_EMAIL=noreply@ila26.com
```

**For SMTP (additional)**:
```env
MAILTRAP_SMTP_HOST=smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your-smtp-username
MAILTRAP_SMTP_PASS=your-smtp-password
```

---

### 5. Implementation Steps

#### Step 1: Create Mail Service Module

Create a mail service to handle email sending:
- `apps/api/src/mail/mail.service.ts` - Email sending logic
- `apps/api/src/mail/mail.module.ts` - Mail module
- `apps/api/src/mail/templates/` - Email templates (optional)

#### Step 2: Create Email Templates

Create email templates for:
- OTP emails (registration)
- Welcome emails (future)
- Invitation emails (future)
- Password reset emails (future)

#### Step 3: Integrate into AuthService

Update `apps/api/src/auth/auth.service.ts`:
- Inject MailService
- Replace `console.log` with `mailService.sendOtp()`

#### Step 4: Configure Mail Module

- Add MailModule to AppModule
- Configure MailService with environment variables

---

## Recommended Approach

### Recommendation: Use API Integration

**Why**:
1. Better for production
2. More reliable
3. Better error handling
4. Works well with Bun's native fetch
5. No additional dependencies needed (can use Bun's fetch)

### Implementation Structure

```
apps/api/src/
├── mail/
│   ├── mail.service.ts        # Main mail service
│   ├── mail.module.ts         # Mail module
│   ├── mail.interface.ts      # Email interfaces/types
│   └── templates/
│       ├── otp-email.template.ts  # OTP email template
│       └── email-templates.ts     # Email template utilities
```

---

## What to Get from Mailtrap Dashboard

### For API Integration:
1. **API Token**: Found in Integrations → API → Token
2. **From Email**: Use your verified domain or Mailtrap test domain
3. **API Endpoint**: `https://send.api.mailtrap.io/api/send`

### For SMTP Integration:
1. **SMTP Host**: Usually `smtp.mailtrap.io` or `live.smtp.mailtrap.io`
2. **SMTP Port**: Usually `2525` (testing) or `465`/`587` (production)
3. **SMTP Username**: Found in Integrations → SMTP
4. **SMTP Password**: Found in Integrations → SMTP

---

## Files to Create/Modify

### New Files:
1. `apps/api/src/mail/mail.service.ts` - Main service
2. `apps/api/src/mail/mail.module.ts` - Module
3. `apps/api/src/mail/mail.interface.ts` - Types
4. `apps/api/src/mail/templates/otp-email.template.ts` - OTP template

### Files to Modify:
1. `apps/api/src/app.module.ts` - Add MailModule
2. `apps/api/src/auth/auth.service.ts` - Use MailService
3. `apps/api/src/auth/auth.module.ts` - Import MailModule
4. `.env` - Add Mailtrap credentials

---

## Quick Start Checklist

- [ ] Create Mailtrap account
- [ ] Get API Token or SMTP credentials
- [ ] Add credentials to `.env` file
- [ ] Install packages (if using SMTP: nodemailer)
- [ ] Create MailService
- [ ] Create MailModule
- [ ] Create OTP email template
- [ ] Update AuthService to use MailService
- [ ] Test OTP email sending

---

## Estimated Time

- **Setup**: 30 minutes (account, credentials)
- **Implementation**: 1-2 hours (service, module, integration)
- **Testing**: 30 minutes
- **Total**: 2-3 hours

---

## Next Steps

Would you like me to:
1. **Implement the MailService** (with API integration)?
2. **Set up the email templates**?
3. **Integrate into AuthService**?

Let me know and I'll start the implementation!

