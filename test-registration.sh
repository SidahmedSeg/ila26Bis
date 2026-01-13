#!/bin/bash
# Quick Registration Test Script

echo "🧪 Testing Registration Flow"
echo "=============================="
echo ""

# Check if server is running
echo "1. Checking server status..."
if curl -s http://localhost:4000/health > /dev/null 2>&1; then
    echo "✅ Server is running"
else
    echo "❌ Server is not running"
    echo "   Start it with: cd apps/api && bun dist/main.js"
    exit 1
fi

echo ""
echo "2. Sending OTP to test@example.com..."
RESPONSE=$(curl -s -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}')

echo "Response: $RESPONSE"
echo ""

# Check if OTP was sent successfully
if echo "$RESPONSE" | grep -q "OTP sent"; then
    echo "✅ OTP sent successfully"
    echo ""
    echo "3. Getting OTP from database..."
    OTP=$(cd /Users/intelifoxdz/ila26Bis && node packages/shared/get-otp-from-db.js test@example.com 2>/dev/null)
    
    if [ -n "$OTP" ] && [ "$OTP" != "null" ]; then
        echo "✅ OTP found: $OTP"
        echo ""
        echo "4. Verifying OTP..."
        VERIFY_RESPONSE=$(curl -s -X POST http://localhost:4000/auth/verify-otp \
          -H "Content-Type: application/json" \
          -d "{\"email\":\"test@example.com\",\"code\":\"$OTP\"}")
        echo "Response: $VERIFY_RESPONSE"
        echo ""
        
        if echo "$VERIFY_RESPONSE" | grep -q "verified"; then
            echo "✅ OTP verified successfully"
            echo ""
            echo "5. Ready to complete registration!"
            echo "   Use the /auth/register endpoint with your details"
        else
            echo "❌ OTP verification failed"
        fi
    else
        echo "⚠️  OTP not found in database"
        echo "   Check Mailtrap inbox or wait a moment and try again"
    fi
else
    echo "❌ Failed to send OTP"
    echo "   Check server logs for details"
fi

echo ""
echo "=============================="
echo "📚 Full test guide: QUICK_REGISTRATION_TEST.md"

