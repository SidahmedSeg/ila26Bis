#!/bin/bash
# Test authenticated endpoints with token

TOKEN=$1
BASE_URL="http://localhost:4000"

if [ -z "$TOKEN" ]; then
    echo "Usage: ./test-with-token.sh <access_token>"
    echo ""
    echo "To get a token:"
    echo "  1. Register a user (get OTP from Mailtrap Email Logs)"
    echo "  2. Complete registration"
    echo "  3. Copy the accessToken from response"
    exit 1
fi

echo "🧪 Testing Authenticated Endpoints"
echo "=================================="
echo ""

echo "1️⃣  Testing GET /enterprise/profile..."
curl -s -X GET ${BASE_URL}/enterprise/profile \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq . 2>/dev/null || echo "Error"
echo ""

echo "2️⃣  Testing GET /enterprise/documents..."
curl -s -X GET ${BASE_URL}/enterprise/documents \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq . 2>/dev/null || echo "Error"
echo ""

echo "3️⃣  Testing GET /enterprise/documents/categories..."
curl -s -X GET ${BASE_URL}/enterprise/documents/categories \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" | jq . 2>/dev/null || echo "Error"
echo ""

echo "✅ Basic authenticated endpoints tested"
