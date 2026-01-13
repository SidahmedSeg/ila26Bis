#!/bin/bash

# Script to send OTP and retrieve it from Mailtrap for testing

set -e

EMAIL="${1:-test@example.com}"
MAILTRAP_API_TOKEN="${MAILTRAP_API_TOKEN:-}"
MAILTRAP_INBOX_ID="${MAILTRAP_INBOX_ID:-}"

echo "🧪 OTP Testing Script"
echo ""

# Step 1: Send OTP
echo "1️⃣ Sending OTP to: $EMAIL"
RESPONSE=$(curl -s -X POST http://localhost:4000/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\"}")

echo "Response: $RESPONSE"
echo ""

# Check if OTP was sent successfully
if echo "$RESPONSE" | grep -q "OTP sent\|message\|success"; then
  echo "✅ OTP sent successfully!"
else
  echo "❌ Failed to send OTP"
  echo "$RESPONSE"
  exit 1
fi

echo ""
echo "2️⃣ Retrieving OTP from Mailtrap..."

# Check if Mailtrap credentials are available
if [ -z "$MAILTRAP_API_TOKEN" ] || [ -z "$MAILTRAP_INBOX_ID" ]; then
  echo "⚠️  Mailtrap API credentials not set"
  echo ""
  echo "To retrieve OTP automatically, set:"
  echo "  export MAILTRAP_API_TOKEN='your-token'"
  echo "  export MAILTRAP_INBOX_ID='your-inbox-id'"
  echo ""
  echo "Or manually check Mailtrap inbox:"
  echo "  https://mailtrap.io/inboxes"
  echo ""
  echo "📧 The OTP code should be in the email sent to: $EMAIL"
  exit 0
fi

# Get latest message from Mailtrap
echo "Fetching latest email from Mailtrap..."
MESSAGE=$(curl -s -X GET \
  "https://mailtrap.io/api/accounts/${MAILTRAP_INBOX_ID}/inboxes/${MAILTRAP_INBOX_ID}/messages" \
  -H "Api-Token: ${MAILTRAP_API_TOKEN}" \
  | jq -r '.[0] // empty')

if [ -z "$MESSAGE" ]; then
  echo "❌ No messages found in Mailtrap inbox"
  exit 1
fi

MESSAGE_ID=$(echo "$MESSAGE" | jq -r '.id')
echo "Found message ID: $MESSAGE_ID"

# Get message content
MESSAGE_CONTENT=$(curl -s -X GET \
  "https://mailtrap.io/api/accounts/${MAILTRAP_INBOX_ID}/inboxes/${MAILTRAP_INBOX_ID}/messages/${MESSAGE_ID}/body.html" \
  -H "Api-Token: ${MAILTRAP_API_TOKEN}")

# Extract OTP code (6 digits)
OTP=$(echo "$MESSAGE_CONTENT" | grep -oE '[0-9]{6}' | head -1)

if [ -z "$OTP" ]; then
  echo "❌ Could not extract OTP from email"
  echo "Email content preview:"
  echo "$MESSAGE_CONTENT" | head -20
else
  echo ""
  echo "✅ OTP Code Found:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "   $OTP"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo ""
  echo "📋 Use this code to verify OTP:"
  echo "   curl -X POST http://localhost:4000/auth/verify-otp \\"
  echo "     -H \"Content-Type: application/json\" \\"
  echo "     -d '{\"email\":\"$EMAIL\",\"code\":\"$OTP\"}'"
fi

