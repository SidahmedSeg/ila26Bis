# How to Get OTP for Testing

## Quick Method

### Option 1: Use the Test Script

```bash
# Send OTP and try to retrieve it automatically
./test-otp.sh test@example.com
```

### Option 2: Manual Steps

1. **Send OTP via API:**
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

2. **Check Mailtrap Inbox:**
   - Go to: https://mailtrap.io/inboxes
   - Login to your Mailtrap account
   - Find the email sent to `test@example.com`
   - The OTP code is a 6-digit number in the email

3. **Verify OTP:**
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"123456"}'
```

## Using Mailtrap API (Automatic)

If you have Mailtrap API credentials:

```bash
export MAILTRAP_API_TOKEN='your-api-token'
export MAILTRAP_INBOX_ID='your-inbox-id'
./test-otp.sh test@example.com
```

The script will automatically:
1. Send OTP
2. Fetch latest email from Mailtrap
3. Extract OTP code
4. Display it for you

## Test Email Addresses

You can use any email address for testing:
- `test@example.com`
- `user@test.com`
- `demo@ila26.com`

The OTP will be sent to Mailtrap (not a real email).

## OTP Format

- **Length**: 6 digits
- **Example**: `123456`, `789012`, etc.
- **Expiration**: Check your backend configuration (usually 10-15 minutes)

## Complete Registration Flow

1. **Send OTP:**
```bash
curl -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

2. **Get OTP from Mailtrap** (see above)

3. **Verify OTP:**
```bash
curl -X POST http://localhost:4000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","code":"YOUR_OTP_HERE"}'
```

4. **Register:**
```bash
curl -X POST http://localhost:4000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "otpCode": "YOUR_OTP_HERE",
    "password": "Test123!@#",
    "confirmPassword": "Test123!@#",
    "fullName": "Test User",
    "companyName": "Test Company",
    "siret": "12345678901234",
    "kbis": "KBIS123"
  }'
```

## Troubleshooting

### OTP not received?
- Check Mailtrap inbox: https://mailtrap.io/inboxes
- Check backend logs for errors
- Verify Mailtrap credentials in `apps/api/.env`

### OTP expired?
- Send a new OTP
- OTPs typically expire after 10-15 minutes

### Can't extract OTP automatically?
- Manually check Mailtrap inbox
- Look for 6-digit number in the email body

