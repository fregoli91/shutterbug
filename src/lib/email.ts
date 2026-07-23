import { site } from '@/lib/seo';

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export type EmailSendResult = {
  sent: boolean;
  provider: 'resend' | 'console';
};

export function getPublicSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || site.domain;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return '';
  return trimmed.replace(/^(['"])(.*)\1$/, '$2').trim();
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text
}: SendEmailOptions): Promise<EmailSendResult> {
  const resendApiKey = cleanEnvValue(process.env.RESEND_API_KEY);
  const from = cleanEnvValue(process.env.EMAIL_FROM) || `Shutterbug Camera Shop <${site.supportEmail}>`;

  if (!resendApiKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('RESEND_API_KEY is not configured.');
    }
    console.info(`[Shutterbug email fallback] To: ${to}\nSubject: ${subject}\n\n${text}`);
    return { sent: false, provider: 'console' };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from,
      to,
      subject,
      html,
      text
    })
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(`Resend email failed with status ${response.status}${errorBody ? `: ${errorBody}` : ''}`);
  }

  return { sent: true, provider: 'resend' };
}

export async function sendCustomerVerificationEmail({
  email,
  name,
  token,
  baseUrl
}: {
  email: string;
  name?: string | null;
  token: string;
  baseUrl?: string;
}) {
  const verificationUrl = new URL('/verify-email', baseUrl || getPublicSiteUrl());
  verificationUrl.searchParams.set('token', token);
  const displayName = name?.trim() || 'there';
  const escapedDisplayName = escapeHtml(displayName);
  const text = `Hi ${displayName},

Welcome to Shutterbug Camera Shop. Please verify your email address by opening this link:

${verificationUrl.toString()}

This link expires in 24 hours. If you did not create a Shutterbug account, you can ignore this email.`;

  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#16231d;background:#fde9cd;padding:24px">
      <div style="max-width:560px;margin:0 auto;background:#fff;border:1px solid rgba(22,35,29,.12);border-radius:8px;padding:24px">
        <p style="font-size:12px;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:#2f6f4e">Shutterbug Camera Shop</p>
        <h1 style="font-family:Georgia,serif;margin:12px 0 8px">Verify your email</h1>
        <p>Hi ${escapedDisplayName}, welcome to Shutterbug Camera Shop. Confirm your email address so your customer account can track orders and purchases.</p>
        <p style="margin:24px 0">
          <a href="${verificationUrl.toString()}" style="display:inline-block;background:#24543a;color:white;text-decoration:none;border-radius:999px;padding:12px 20px;font-weight:700">Verify email</a>
        </p>
        <p style="font-size:14px;color:rgba(22,35,29,.72)">This link expires in 24 hours. If the button does not work, paste this URL into your browser:</p>
        <p style="font-size:13px;word-break:break-all;color:#2f6f4e">${verificationUrl.toString()}</p>
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    to: email,
    subject: 'Verify your Shutterbug account',
    html,
    text
  });
}
