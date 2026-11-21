import { promises as dnsPromises } from "node:dns";
import nodemailer from "nodemailer";

async function gmailIPv4(): Promise<string> {
  const { address } = await dnsPromises.lookup("smtp.gmail.com", { family: 4 });
  return address;
}

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

export function mailConfigured(): boolean {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = envPass();
  return Boolean(user && pass);
}

function credentials() {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = envPass();
  if (!user || !pass) {
    throw new Error("EMAIL_USER ან EMAIL_PASS აკლია Render Environment-ში");
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
  return text.slice(0, 180) || "SMTP failed";
}

function transports(ipv4: string) {
  const { user, pass } = credentials();
  const auth = { user, pass };
  const base = {
    host: ipv4,
    auth,
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
    tls: { servername: "smtp.gmail.com" },
  };
  return [
    nodemailer.createTransport({
      ...base,
      port: 587,
      secure: false,
      requireTLS: true,
    }),
    nodemailer.createTransport({
      ...base,
      port: 465,
      secure: true,
    }),
  ];
}

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
  replyTo?: string;
}) => {
  const { user, pass } = credentials();
  const ipv4 = await gmailIPv4();
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

  const errors: unknown[] = [];
  for (const transporter of transports(ipv4)) {
    try {
      await transporter.sendMail(payload);
      console.log("SMTP sent", { to: options.email, from: user, ipv4 });
      return;
    } catch (err) {
      console.error("SMTP attempt failed", { ipv4, err });
      errors.push(err);
      try {
        transporter.close();
      } catch {
        /* ignore */
      }
    }
  }

  console.error("SMTP all attempts failed", {
    to: options.email,
    hasUser: Boolean(user),
    passLen: pass.length,
    hint: "SMTP one attempt failed",
    last: errors[errors.length - 1],
  });
  throw errors[errors.length - 1] || new Error("SMTP failed");
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
