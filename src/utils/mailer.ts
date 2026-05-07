import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { reportError } from 'node-server-engine';

/**
 * Generic Mail options extending standard Nodemailer options
 */
export interface MailOptions extends SendMailOptions {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}

/**
 * Mailer Configuration interface
 */
interface MailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    address: string;
    name: string;
  };
}

function normalizeMailerUser(
  mailUser: string | undefined,
  fromEmail: string
): string {
  const trimmedMailUser = mailUser?.trim();
  const trimmedFromEmail = fromEmail.trim();

  if (trimmedMailUser && trimmedMailUser.includes('@')) {
    return trimmedMailUser;
  }

  return trimmedFromEmail;
}

interface SmtpErrorShape {
  code?: string;
  responseCode?: number;
  response?: string;
  message?: string;
}

let transporter: Transporter | null = null;

/**
 * Validates and retrieves current mail configuration from environment variables
 */
function getMailConfig(): MailConfig {
  const {
    MAIL_HOST,
    MAIL_USER,
    MAIL_PASSWORD,
    MAIL_FROM_EMAIL,
    MAIL_FROM_NAME,
    MAIL_PORT,
    MAIL_SECURE
  } = process.env;

  if (!MAIL_HOST || !MAIL_USER || !MAIL_PASSWORD || !MAIL_FROM_EMAIL) {
    throw new Error(
      'Mailing system configuration is incomplete. Please ensure MAIL_HOST, MAIL_USER, MAIL_PASSWORD, and MAIL_FROM_EMAIL are set.'
    );
  }

  const fromAddress = MAIL_FROM_EMAIL.trim();
  const authUser = normalizeMailerUser(MAIL_USER, fromAddress);

  return {
    host: MAIL_HOST,
    port: parseInt(MAIL_PORT || '587', 10),
    secure: MAIL_SECURE === 'true',
    auth: {
      user: authUser,
      pass: MAIL_PASSWORD
    },
    from: {
      address: fromAddress,
      name: MAIL_FROM_NAME || 'OMG Temple ERP'
    }
  };
}

/**
 * Initializes and returns the Nodemailer Transporter (Singleton)
 */
function getTransporter(): Transporter {
  if (!transporter) {
    const config = getMailConfig();
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: config.auth
    });
  }
  return transporter;
}

/**
 * Generic function to send an email using the configured SMTP transporter.
 * Professional implementation with error reporting and singleton management.
 *
 * @param options - The email options (to, subject, body, etc.)
 * @returns Promise<boolean> - True if the email was sent successfully
 */
export async function sendMail(options: MailOptions): Promise<boolean> {
  try {
    const config = getMailConfig();
    const mailTransporter = getTransporter();

    const mailOptions: SendMailOptions = {
      from: `"${config.from.name}" <${config.from.address}>`,
      ...options
    };

    const info = await mailTransporter.sendMail(mailOptions);
    return !!info.messageId;
  } catch (error) {
    const smtpError = error as SmtpErrorShape;
    const normalizedMessage = [smtpError?.message, smtpError?.response]
      .filter((value): value is string => typeof value === 'string')
      .join(' | ')
      .toLowerCase();

    const isGmailAuthFailure =
      smtpError?.code === 'EAUTH' ||
      smtpError?.responseCode === 535 ||
      normalizedMessage.includes('username and password not accepted') ||
      normalizedMessage.includes('badcredentials');

    if (isGmailAuthFailure) {
      reportError(
        'Failed to send email: Gmail SMTP authentication failed. If using Gmail, set MAIL_USER to your full Gmail address and MAIL_PASSWORD to a Google App Password (not your normal account password).'
      );
      return false;
    }

    reportError(
      `Failed to send email: ${
        smtpError?.message || smtpError?.response || 'Unknown SMTP error'
      }`
    );
    return false;
  }
}
