/**
 * Email helper using Resend
 * Used for ticket notifications to customers and admins
 */
import { Resend } from "resend";
import { ENV } from "./_core/env";

let resend: Resend | null = null;

function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  if (!resend) resend = new Resend(apiKey);
  return resend;
}

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@mavekbcs.com";
const PORTAL_URL = "https://mavekbcs.com/portal";

// ── Ticket status labels ──────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

// ── Send ticket status change email to customer ───────────────────────────────
export async function sendTicketStatusEmail(params: {
  toEmail: string;
  toName: string;
  ticketNumber: string;
  ticketTitle: string;
  newStatus: string;
  adminFeedback?: string;
  spentHours?: number;
}): Promise<void> {
  const client = getResend();
  if (!client) {
    console.warn("[Email] RESEND_API_KEY not set, skipping email");
    return;
  }

  const statusLabel = STATUS_LABELS[params.newStatus] ?? params.newStatus;
  const feedbackSection = params.adminFeedback
    ? `<p style="margin:16px 0;"><strong>Feedback from MAVEK BCS:</strong><br/>${params.adminFeedback}</p>`
    : "";
  const hoursSection =
    params.spentHours && params.spentHours > 0
      ? `<p style="margin:8px 0;color:#888;">Hours used: <strong>${params.spentHours}</strong></p>`
      : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
      <div style="background:#0d1117;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h2 style="color:#c9a84c;margin:0;font-size:20px;">MAVEK BCS Client Portal</h2>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">Ticket Status Update</p>
      </div>
      <div style="background:#fff;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
        <p>Dear ${params.toName},</p>
        <p>Your support ticket has been updated.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:40%;">Ticket Number</td><td style="padding:8px;">${params.ticketNumber}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Title</td><td style="padding:8px;">${params.ticketTitle}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Status</td><td style="padding:8px;"><strong style="color:#c9a84c;">${statusLabel}</strong></td></tr>
        </table>
        ${feedbackSection}
        ${hoursSection}
        <p style="margin-top:24px;">
          <a href="${PORTAL_URL}" style="background:#c9a84c;color:#000;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold;">View in Portal</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="font-size:12px;color:#888;">This is an automated notification from MAVEK BCS Client Portal.<br/>Please do not reply to this email.</p>
      </div>
    </div>
  `;

  await client.emails.send({
    from: `MAVEK BCS <${FROM_EMAIL}>`,
    to: params.toEmail,
    subject: `[${params.ticketNumber}] Ticket Status Updated: ${statusLabel}`,
    html,
  });
}

// ── Send new ticket notification to all admins ────────────────────────────────
export async function sendNewTicketAdminEmail(params: {
  adminEmails: string[];
  ticketNumber: string;
  ticketTitle: string;
  customerName: string;
  description?: string;
}): Promise<void> {
  const client = getResend();
  if (!client) {
    console.warn("[Email] RESEND_API_KEY not set, skipping admin email");
    return;
  }
  if (!params.adminEmails.length) return;

  const descSection = params.description
    ? `<p style="margin:16px 0;background:#f5f5f5;padding:12px;border-radius:4px;font-size:14px;">${params.description.substring(0, 500)}${params.description.length > 500 ? "..." : ""}</p>`
    : "";

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#222;">
      <div style="background:#0d1117;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h2 style="color:#c9a84c;margin:0;font-size:20px;">MAVEK BCS Admin Portal</h2>
        <p style="color:#aaa;margin:4px 0 0;font-size:13px;">New Support Ticket</p>
      </div>
      <div style="background:#fff;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid #e0e0e0;">
        <p>A new support ticket has been submitted.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;width:40%;">Ticket Number</td><td style="padding:8px;">${params.ticketNumber}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Customer</td><td style="padding:8px;">${params.customerName}</td></tr>
          <tr><td style="padding:8px;background:#f5f5f5;font-weight:bold;">Title</td><td style="padding:8px;">${params.ticketTitle}</td></tr>
        </table>
        ${descSection}
        <p style="margin-top:24px;">
          <a href="https://mavekbcs.com/portal/admin/login" style="background:#c9a84c;color:#000;padding:10px 20px;border-radius:4px;text-decoration:none;font-weight:bold;">View in Admin Portal</a>
        </p>
        <hr style="border:none;border-top:1px solid #eee;margin:24px 0;"/>
        <p style="font-size:12px;color:#888;">This is an automated notification from MAVEK BCS Admin Portal.</p>
      </div>
    </div>
  `;

  // Send to all admins (batch)
  for (const email of params.adminEmails) {
    await client.emails.send({
      from: `MAVEK BCS <${FROM_EMAIL}>`,
      to: email,
      subject: `[NEW] ${params.ticketNumber} — ${params.ticketTitle} (from ${params.customerName})`,
      html,
    });
  }
}
