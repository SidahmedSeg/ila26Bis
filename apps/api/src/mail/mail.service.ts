import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendEmailOptions, MailtrapApiResponse } from './mail.interface';
import {
  generateOtpEmailHtml,
  generateOtpEmailText,
} from './templates/otp-email.template';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly apiToken: string;
  private readonly fromEmail: string;
  private readonly apiEndpoint = 'https://send.api.mailtrap.io/api/send';

  constructor(private configService: ConfigService) {
    this.apiToken = this.configService.get<string>('MAILTRAP_API_TOKEN') || '';
    this.fromEmail =
      this.configService.get<string>('MAILTRAP_FROM_EMAIL') ||
      'noreply@ila26.com';

    if (!this.apiToken) {
      this.logger.warn(
        'MAILTRAP_API_TOKEN not found. Email sending will fail in production.',
      );
    }
  }

  async sendEmail(options: SendEmailOptions): Promise<MailtrapApiResponse> {
    const { to, subject, text, html, from } = options;

    // Ensure 'to' is an array
    const recipients = Array.isArray(to) ? to : [to];

    // Use provided 'from' or fallback to configured email
    const fromEmail = from || this.fromEmail;

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: { email: fromEmail },
          to: recipients.map((email) => ({ email })),
          subject,
          text: text || '',
          html: html || text || '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        this.logger.error(
          `Mailtrap API error: ${response.status} - ${JSON.stringify(data)}`,
        );
        throw new Error(
          `Failed to send email: ${response.status} ${JSON.stringify(data)}`,
        );
      }

      this.logger.log(`Email sent successfully to ${recipients.join(', ')}`);
      return {
        success: true,
        message_ids: data.message_ids || [],
      };
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async sendOtpEmail(
    email: string,
    otpCode: string,
    expiresInMinutes = 10,
  ): Promise<void> {
    const html = generateOtpEmailHtml({ otpCode, email, expiresInMinutes });
    const text = generateOtpEmailText({ otpCode, email, expiresInMinutes });

    await this.sendEmail({
      to: email,
      subject: 'Your ila26 Verification Code',
      html,
      text,
    });
  }
}

