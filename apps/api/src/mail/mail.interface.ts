export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
}

export interface MailtrapApiResponse {
  success: boolean;
  message_ids?: string[];
  errors?: string[];
}

