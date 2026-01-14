#!/bin/bash
# Comprehensive Registration Flow Test

set -e

EMAIL="test-registration-$(date +%s)@example.com"
BASE_URL="http://localhost:4000"

echo "🧪 Testing Complete Registration Flow"
echo "======================================"
echo ""
echo "Email: $EMAIL"
echo ""

# Step 1: Send OTP
echo "1️⃣  Sending OTP..."
OTP_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\"}")

echo "Response: $OTP_RESPONSE"
echo ""

if echo "$OTP_RESPONSE" | grep -q "OTP sent"; then
    echo "✅ OTP sent successfully"
else
    echo "❌ Failed to send OTP"
    exit 1
fi

# Step 2: Get OTP from database (for testing)
echo ""
echo "2️⃣  Getting OTP from database..."
sleep 2
OTP_CODE=$(cd /Users/intelifoxdz/ila26Bis && node packages/shared/get-otp-from-db.js "${EMAIL}" 2>/dev/null | grep -E "^[0-9]{6}$" | head -1 || echo "")

if [ -z "$OTP_CODE" ]; then
    echo "⚠️  Could not retrieve OTP from database"
    echo "   Please check Mailtrap Email Logs for the OTP code"
    echo "   Or enter OTP manually to continue testing"
    read -p "Enter OTP code (6 digits): " OTP_CODE
fi

echo "OTP Code: $OTP_CODE"
echo ""

# Step 3: Verify OTP
echo "3️⃣  Verifying OTP..."
VERIFY_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"code\":\"${OTP_CODE}\"}")

echo "Response: $VERIFY_RESPONSE"
echo ""

if echo "$VERIFY_RESPONSE" | grep -q "verified"; then
    echo "✅ OTP verified successfully"
else
    echo "❌ Failed to verify OTP"
    echo "Error: $VERIFY_RESPONSE"
    exit 1
fi

# Step 4: Complete Registration
echo ""
echo "4️⃣  Completing Registration..."
REGISTER_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"fullName\": \"Test User\",
    \"companyName\": \"Test Company\",
    \"siret\": \"12345678901234\",
    \"kbis\": \"KBIS123456\",
    \"password\": \"SecurePass123!\",
    \"confirmPassword\": \"SecurePass123!\",
    \"otpCode\": \"${OTP_CODE}\"
  }")

echo "Response: $REGISTER_RESPONSE" | jq . 2>/dev/null || echo "Response: $REGISTER_RESPONSE"
echo ""

if echo "$REGISTER_RESPONSE" | grep -q "accessToken\|access_token"; then
    echo "✅ Registration completed successfully"
    
    # Extract token for further testing
    TOKEN=$(echo "$REGISTER_RESPONSE" | jq -r '.accessToken // .access_token // empty' 2>/dev/null || echo "")
    if [ -n "$TOKEN" ]; then
        echo ""
        echo "🔑 Access Token: ${TOKEN:0:50}..."
        echo "Token saved to /tmp/test-token.txt"
        echo "$TOKEN" > /tmp/test-token.txt
        echo "$EMAIL" > /tmp/test-email.txt
    fi
else
    echo "❌ Registration failed"
    echo "Error: $REGISTER_RESPONSE"
    exit 1
fi

echo ""
echo "✅✅✅ Registration Flow Test Complete! ✅✅✅"
echo ""
echo "Next: Test login and enterprise endpoints"

