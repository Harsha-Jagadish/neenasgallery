import { NextResponse } from "next/server";
import { Resend } from "resend";

import { site } from "@/content/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ContactPayload {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  date?: string;
}

const MAX_LENGTHS = {
  name: 100,
  email: 200,
  phone: 40,
  subject: 200,
  message: 2000,
  date: 30,
} as const;

function clean(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * POST /api/contact
 *
 * Accepts the ContactSheet form submission, validates, and sends an email
 * via Resend to the gallery inbox (defaults to `site.email`; can override
 * via CONTACT_TO_EMAIL env var). Visitor's email is set as Reply-To so
 * Kineena's reply goes straight back to them.
 *
 * Env vars:
 *   RESEND_API_KEY      — required, secret. From https://resend.com/api-keys
 *   CONTACT_FROM_EMAIL  — optional. Sender address. Must be on a verified
 *                         Resend domain. Defaults to "onboarding@resend.dev"
 *                         (Resend's test sender) so the route works out of
 *                         the box, but emails sent from that address can
 *                         only be delivered to the Resend account owner.
 *                         Verify a domain in Resend and set this to e.g.
 *                         "noreply@neenasgallery.com" for production.
 *   CONTACT_TO_EMAIL    — optional. Override destination address.
 *                         Defaults to site.email.
 */
export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 }
    );
  }

  let body: ContactPayload;
  try {
    body = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const name = clean(body.name, MAX_LENGTHS.name);
  const email = clean(body.email, MAX_LENGTHS.email);
  const phone = clean(body.phone, MAX_LENGTHS.phone);
  const subject = clean(body.subject, MAX_LENGTHS.subject);
  const message = clean(body.message, MAX_LENGTHS.message);
  const date = clean(body.date, MAX_LENGTHS.date);

  if (!name) {
    return NextResponse.json(
      { error: "Name is required." },
      { status: 400 }
    );
  }
  if (!email || !/.+@.+\..+/.test(email)) {
    return NextResponse.json(
      { error: "A valid email is required." },
      { status: 400 }
    );
  }
  if (!message) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 }
    );
  }

  const resend = new Resend(apiKey);
  const from = process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";
  const to = process.env.CONTACT_TO_EMAIL ?? site.email;
  const emailSubject = subject || "New inquiry from the gallery site";

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: name },
    { label: "Email", value: email },
  ];
  if (phone) rows.push({ label: "Phone", value: phone });
  if (subject) rows.push({ label: "Subject", value: subject });
  if (date) rows.push({ label: "Preferred date", value: date });

  const metadataHtml = rows
    .map(
      (r) =>
        `<tr><td style="padding:6px 12px 6px 0;color:#666;font-size:13px;vertical-align:top;width:140px;">${escapeHtml(
          r.label
        )}</td><td style="padding:6px 0;color:#1c1f24;font-size:14px;">${escapeHtml(
          r.value
        )}</td></tr>`
    )
    .join("");

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#faf7f1;font-family:Georgia,serif;color:#1c1f24;">
  <div style="max-width:600px;margin:0 auto;padding:40px 24px;">
    <p style="font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#666;margin:0 0 12px;">
      Neena Kang Gallery &mdash; new inquiry
    </p>
    <h1 style="font-size:24px;line-height:1.25;margin:0 0 24px;color:#1c1f24;">
      ${escapeHtml(emailSubject)}
    </h1>
    <table cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;margin-bottom:24px;">
      ${metadataHtml}
    </table>
    <div style="border-top:1px solid #d8d3c8;padding-top:24px;">
      <p style="font-size:11px;letter-spacing:0.32em;text-transform:uppercase;color:#666;margin:0 0 12px;">Message</p>
      <div style="font-size:15px;line-height:1.7;color:#1c1f24;white-space:pre-wrap;">${escapeHtml(
        message
      )}</div>
    </div>
    <p style="margin-top:32px;font-size:12px;color:#888;">
      Reply directly to this email and it will reach ${escapeHtml(name)} at ${escapeHtml(email)}.
    </p>
  </div>
</body></html>`;

  const text = [
    `New inquiry — ${emailSubject}`,
    "",
    ...rows.map((r) => `${r.label}: ${r.value}`),
    "",
    "Message:",
    message,
    "",
    `Reply to this email to respond to ${name} at ${email}.`,
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: emailSubject,
      html,
      text,
    });

    if (error) {
      console.error("[contact] Resend error", error);
      return NextResponse.json(
        { error: "Could not send the message right now." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] Unexpected send failure", e);
    return NextResponse.json(
      { error: "Could not send the message right now." },
      { status: 500 }
    );
  }
}
