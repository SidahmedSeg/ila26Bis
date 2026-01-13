export interface OtpEmailData {
  otpCode: string;
  email: string;
  expiresInMinutes?: number;
}

export function generateOtpEmailHtml(data: OtpEmailData): string {
  const expiresIn = data.expiresInMinutes || 10;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your OTP Code</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px;">
    <h1 style="color: #2c3e50; margin-top: 0;">Your Verification Code</h1>
    
    <p>Hello,</p>
    
    <p>Your verification code for ila26 is:</p>
    
    <div style="background-color: #ffffff; border: 2px solid #3498db; border-radius: 5px; padding: 20px; text-align: center; margin: 20px 0;">
      <h2 style="color: #3498db; font-size: 32px; letter-spacing: 5px; margin: 0;">${data.otpCode}</h2>
    </div>
    
    <p>This code will expire in <strong>${expiresIn} minutes</strong>.</p>
    
    <p>If you didn't request this code, please ignore this email.</p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
    
    <p style="color: #7f8c8d; font-size: 12px;">
      This is an automated message from ila26. Please do not reply to this email.
    </p>
  </div>
</body>
</html>
  `.trim();
}

export function generateOtpEmailText(data: OtpEmailData): string {
  const expiresIn = data.expiresInMinutes || 10;

  return `
Your Verification Code

Hello,

Your verification code for ila26 is: ${data.otpCode}

This code will expire in ${expiresIn} minutes.

If you didn't request this code, please ignore this email.

---
This is an automated message from ila26. Please do not reply to this email.
  `.trim();
}

