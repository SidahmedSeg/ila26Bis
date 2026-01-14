#!/bin/bash
# Comprehensive API Testing Script

set -e

BASE_URL="http://localhost:4000"
EMAIL="test-api-$(date +%s)@example.com"
PASSWORD="SecurePass123!"

echo "🧪 Comprehensive API Testing"
echo "=============================="
echo ""

# Check server health
echo "1️⃣  Checking server health..."
HEALTH=$(curl -s ${BASE_URL}/health)
echo "$HEALTH" | jq . 2>/dev/null || echo "$HEALTH"
echo ""

# Test Registration Flow
echo "2️⃣  Testing Registration Flow..."
echo "   Sending OTP..."
OTP_RESPONSE=$(curl -s -X POST ${BASE_URL}/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\"}")

if echo "$OTP_RESPONSE" | grep -q "OTP sent"; then
    echo "   ✅ OTP sent"
    echo "   ⚠️  Note: OTP code is hashed in DB. Check Mailtrap Email Logs for code."
    echo "   For testing, you can use a test endpoint or check email logs."
    echo ""
    echo "   To continue manually:"
    echo "   1. Check Mailtrap Email Logs: https://mailtrap.io/email-logs"
    echo "   2. Get OTP code from email"
    echo "   3. Run: curl -X POST ${BASE_URL}/auth/verify-otp -H 'Content-Type: application/json' -d '{\"email\":\"${EMAIL}\",\"code\":\"YOUR_OTP\"}'"
else
    echo "   ❌ Failed to send OTP"
    exit 1
fi

echo ""
echo "3️⃣  Testing Enterprise Endpoints (requires authentication)..."
echo "   ⚠️  These endpoints require a valid JWT token"
echo "   First complete registration/login to get a token"
echo ""

# Test Public Endpoints
echo "4️⃣  Testing Public Endpoints..."

echo "   Testing GET /enterprise/activities..."
ACTIVITIES=$(curl -s -X GET ${BASE_URL}/enterprise/activities \
  -H "Content-Type: application/json")
echo "   Response: $ACTIVITIES" | jq . 2>/dev/null | head -10 || echo "   Response: $ACTIVITIES"
echo ""

echo "   Testing GET /enterprise/specialities..."
SPECIALITIES=$(curl -s -X GET "${BASE_URL}/enterprise/specialities?activityId=1" \
  -H "Content-Type: application/json")
echo "   Response: $SPECIALITIES" | jq . 2>/dev/null | head -10 || echo "   Response: $SPECIALITIES"
echo ""

echo "✅ Public endpoints tested"
echo ""
echo "📋 Next Steps:"
echo "   1. Complete registration to get access token"
echo "   2. Test authenticated endpoints with token"
echo "   3. Test file uploads"
echo "   4. Test external API integrations"

