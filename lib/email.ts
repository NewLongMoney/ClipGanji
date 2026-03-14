/**
 * Email sending via Nodemailer (Gmail SMTP). No 3rd-party email services.
 * Requires EMAIL_USER and EMAIL_PASS in env (e.g. clipganji@gmail.com + app password).
 */
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { escapeHtml } from '@/lib/security';

function getAdminEmail(): string {
  const e = process.env.ADMIN_EMAIL;
  return typeof e === 'string' && e.trim() ? e.trim().toLowerCase() : 'clipganji@gmail.com';
}
export const ADMIN_EMAIL = getAdminEmail();
const LOGO_URL = 'https://clipganji.com/images/LogoNoBackground.png';
const SITE_URL = 'https://clipganji.com';

let _transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) return null;
  if (!_transporter) {
    _transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    });
  }
  return _transporter;
}

export function isEmailConfigured(): boolean {
  return !!(process.env.EMAIL_USER && process.env.EMAIL_PASS);
}

export async function sendMail(options: {
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
}): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) throw new Error('Email is not configured (EMAIL_USER/EMAIL_PASS).');
  
  await transporter.sendMail({
    from: options.from,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    html: options.html,
    attachments: options.attachments?.map((a) => ({ filename: a.filename, content: a.content })),
  });
}

// ─── Shared email layout (application-details style) ───────────────────────

function emailWrapper(title: string, orgName: string, tagline: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
    <div style="background: #000; color: #fff; padding: 40px 24px; text-align: center; position: relative;">
      <img src="${LOGO_URL}" alt="ClipGanji" style="height: 80px; margin-bottom: 20px; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.5));" />
      <h1 style="margin: 0 0 12px 0; font-size: 26px; font-weight: 800; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">${escapeHtml(title)}</h1>
      <p style="margin: 0; font-size: 16px; opacity: 0.95; font-weight: 500;">${escapeHtml(orgName)}</p>
      <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.85; font-style: italic;">${escapeHtml(tagline)}</p>
    </div>
    <div style="padding: 24px; color: #333;">
      ${bodyHtml}
    </div>
    <div style="padding: 16px 24px; background: #f8f8f8; font-size: 12px; color: #333; border-top: 4px solid #00C853;">
      <a href="${SITE_URL}" style="color: #00C853; text-decoration: none; font-weight: 700;">clipganji.com</a> · <a href="mailto:${ADMIN_EMAIL}" style="color: #000; text-decoration: none; font-weight: 600;">${ADMIN_EMAIL}</a>
    </div>
  </div>
</body>
</html>`;
}

function detailCard(title: string, iconLabel: string, content: string): string {
  return `
    <div style="background: #f0f9f0; border: 2px solid #00C853; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,200,83,0.15);">
      <p style="margin: 0 0 8px 0; font-weight: 700; color: #000; font-size: 16px; display: flex; align-items: center;">📋 ${escapeHtml(title)}</p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #333;">${content}</p>
    </div>`;
}

function infoCard(title: string, rows: Array<{ label: string; value: string }>): string {
  const cells = rows
    .map(
      (r) =>
        `<p style="margin: 0 0 8px 0; font-size: 14px;"><span style="color: #666;">${escapeHtml(r.label)}</span> <strong>${escapeHtml(r.value)}</strong></p>`
    )
    .join('');
  return `
    <div style="background: #f5f5f5; border: 2px solid #000; border-radius: 12px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <p style="margin: 0 0 12px 0; font-weight: 700; color: #000; font-size: 16px; display: flex; align-items: center;">📊 ${escapeHtml(title)}</p>
      ${cells}
    </div>`;
}

// ─── Contact (campaign brief) ──────────────────────────────────────────────

export function buildContactAdminHtml(data: {
  companyName: string;
  name: string;
  email: string;
  budget: string;
  message: string;
  requestRateCard: boolean;
  requestPitchDeck: boolean;
}): string {
  const body = `
    ${detailCard(
      'Application Details',
      'Campaign brief',
      'A new campaign brief has been submitted through the website.'
    )}
    ${infoCard('Contact & budget', [
      { label: 'Company:', value: data.companyName },
      { label: 'Name:', value: data.name },
      { label: 'Email:', value: data.email },
      { label: 'Budget:', value: data.budget },
      { label: 'Requested Rate Card:', value: data.requestRateCard ? 'Yes' : 'No' },
      { label: 'Requested Pitch Deck:', value: data.requestPitchDeck ? 'Yes' : 'No' },
    ])}
    <p style="margin: 0 0 8px 0; font-weight: 700; color: #1e3a5f; font-size: 14px;">Message / Brief</p>
    <div style="background: #f5f5f5; border-radius: 8px; padding: 16px; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
    <p style="margin: 16px 0 0 0; font-size: 13px; color: #666;">Please review and reply to <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>.</p>
  `;
  return emailWrapper('New Campaign Brief', 'ClipGanji', 'Your brand inside every clip. Every view verified.', body);
}

export function buildContactSenderHtml(data: {
  name: string;
  companyName: string;
  requestRateCard: boolean;
  requestPitchDeck: boolean;
  rateCardAttached?: boolean;
  pitchDeckAttached?: boolean;
}): string {
  const notes: string[] = [];
  if (data.requestRateCard && data.rateCardAttached) notes.push('Your confidential Rate Card is attached.');
  else if (data.requestRateCard) notes.push('You requested the Rate Card; we will send it separately if needed.');
  if (data.requestPitchDeck && data.pitchDeckAttached) notes.push('The Pitch Deck is attached.');
  else if (data.requestPitchDeck) notes.push('You requested the Pitch Deck; we will send it separately if needed.');
  const notesHtml = notes.length ? notes.map((n) => `<p style="margin: 16px 0 0 0; font-size: 14px;">${escapeHtml(n)}</p>`).join('') : '';
  const body = `
    ${detailCard(
      'Application Details',
      'Confirmation',
      'We have received your campaign brief and our team is reviewing it. We typically respond within 24 hours.'
    )}
    <p style="margin: 0; font-size: 14px;">Hi <strong>${escapeHtml(data.name)}</strong>,</p>
    <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6;">Thank you for reaching out. Your brief for <strong>${escapeHtml(data.companyName)}</strong> is in our queue.</p>
    ${notesHtml}
    <p style="margin: 20px 0 0 0; font-size: 14px; color: #666;">— The ClipGanji Team</p>
  `;
  return emailWrapper('Campaign Brief Received', 'ClipGanji', 'Your brand inside every clip. Every view verified.', body);
}

// ─── Clipper registration ──────────────────────────────────────────────────

export function buildClipperAdminHtml(data: {
  fullName: string;
  email: string;
  phone: string;
  county: string;
  tiktokHandle: string | null;
  instagramHandle: string | null;
  payoutMethod: string;
}): string {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Name:', value: data.fullName },
    { label: 'Email:', value: data.email },
    { label: 'Phone:', value: data.phone },
    { label: 'County:', value: data.county },
    { label: 'Payout method:', value: data.payoutMethod },
  ];
  if (data.tiktokHandle) rows.push({ label: 'TikTok:', value: data.tiktokHandle });
  if (data.instagramHandle) rows.push({ label: 'Instagram:', value: data.instagramHandle });
  const body = `
    ${detailCard(
      'Application Details',
      'Clipper sign-up',
      'A new clipper has signed up through the portal.'
    )}
    ${infoCard('Personal Information', rows)}
    <p style="margin: 16px 0 0 0; font-size: 13px; color: #666;">Review in the admin dashboard.</p>
  `;
  return emailWrapper('New Clipper Sign-Up', 'ClipGanji', 'Your brand inside every clip. Every view verified.', body);
}

export function buildClipperSenderHtml(data: { fullName: string }): string {
  const body = `
    ${detailCard(
      'Application Details',
      'Confirmation',
      'Your clipper application has been received. We will review your profile and get back to you soon.'
    )}
    <p style="margin: 0; font-size: 14px;">Hi <strong>${escapeHtml(data.fullName)}</strong>,</p>
    <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6;">Thank you for signing up as a ClipGanji clipper. You will hear from us once your profile is reviewed.</p>
    <p style="margin: 20px 0 0 0; font-size: 14px; color: #666;">— The ClipGanji Team</p>
  `;
  return emailWrapper('Clipper Application Received', 'ClipGanji', 'Your brand inside every clip. Every view verified.', body);
}
