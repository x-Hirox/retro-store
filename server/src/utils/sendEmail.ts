import { promises as dnsPromises } from "node:dns";
import nodemailer from "nodemailer";

export function shopMail(): string {
  return (
    process.env.EMAIL_USER ||
    process.env.CONTACT_EMAIL ||
    "retrobit.support@gmail.com"
  );
}

export function inboxMail(): string {
  return process.env.CONTACT_EMAIL || shopMail();
}

export function frontendBaseUrl(origin?: string | string[]): string {
  const configured = (
    process.env.FRONTEND_URL || "https://retrobit.ge"
  ).replace(/\/$/, "");
  const raw = Array.isArray(origin) ? origin[0] : origin;
  const o = String(raw || "").replace(/\/$/, "");
  const allowed = new Set([
    configured,
    "https://retrobit.ge",
    "https://www.retrobit.ge",
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ]);
  if (o && allowed.has(o)) return o;
  return configured;
}

function envPass() {
  return String(process.env.EMAIL_PASS || "")
    .replace(/\s/g, "")
    .replace(/^["']+|["']+$/g, "");
}

function resendKey() {
  return String(process.env.RESEND_API_KEY || "").trim();
}

export function mailConfigured(): boolean {
  if (resendKey()) return true;
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = envPass();
  return Boolean(user && pass);
}

function credentials() {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = envPass();
  if (!user || !pass) {
    throw new Error("EMAIL_USER ან EMAIL_PASS აკლია");
  }
  return { user, pass };
}

export function mailErrorText(err: unknown): string {
  const e = err as {
    code?: string;
    command?: string;
    response?: string;
    message?: string;
  };
  const bits = [e.code, e.command, e.response || e.message].filter(Boolean);
  const text = bits.join(" ").replace(/\s+/g, " ").trim();
  return text.slice(0, 180) || "Mail failed";
}

async function sendViaResend(options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
  replyTo?: string;
}) {
  const key = resendKey();
  const from =
    process.env.RESEND_FROM?.trim() || "RetroBit <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [options.email],
      reply_to: options.replyTo || shopMail(),
      subject: options.subject,
      text: options.message,
      html:
        options.html ||
        `<pre style="font-family:sans-serif;white-space:pre-wrap">${options.message
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")}</pre>`,
    }),
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`Resend ${res.status} ${body.slice(0, 160)}`);
  }
  console.log("Resend sent", { to: options.email, from });
}

async function sendViaSmtp(options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
  replyTo?: string;
}) {
  const { user, pass } = credentials();
  const { address: ipv4 } = await dnsPromises.lookup("smtp.gmail.com", {
    family: 4,
  });
  const payload = {
    from: `"RetroBit" <${user}>`,
    to: options.email,
    replyTo: options.replyTo || user,
    subject: options.subject,
    text: options.message,
    html:
      options.html ||
      `<pre style="font-family:sans-serif;white-space:pre-wrap">${options.message
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</pre>`,
  };
  const transporter = nodemailer.createTransport({
    host: ipv4,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    tls: { servername: "smtp.gmail.com" },
  });
  try {
    await transporter.sendMail(payload);
    console.log("SMTP sent", { to: options.email, from: user, ipv4 });
  } finally {
    try {
      transporter.close();
    } catch {
      /* ignore */
    }
  }
}

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
  replyTo?: string;
}) => {
  if (resendKey()) {
    await sendViaResend(options);
    return;
  }

  if (process.env.RENDER) {
    throw new Error(
      "Render-ზე Gmail SMTP დახურულია (პორტი 587/465). დაამატე RESEND_API_KEY",
    );
  }

  await sendViaSmtp(options);
};

export async function trySendEmail(
  options: Parameters<typeof sendEmail>[0],
): Promise<boolean> {
  try {
    await sendEmail(options);
    return true;
  } catch (err) {
    console.error("Mail failed:", err);
    return false;
  }
}
