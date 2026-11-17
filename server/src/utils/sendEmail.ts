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

type MailPayload = {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  html: string;
};

let transporter: nodemailer.Transporter | null = null;
let transporterPort: 465 | 587 | null = null;

function credentials() {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = String(process.env.EMAIL_PASS || "").replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("EMAIL_USER ან EMAIL_PASS აკლია");
  }
  return { user, pass };
}

function createTransport(port: 465 | 587) {
  const { user, pass } = credentials();
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string) {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(label)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

async function sendWith(port: 465 | 587, payload: MailPayload) {
  if (!transporter || transporterPort !== port) {
    transporter = createTransport(port);
    transporterPort = port;
  }
  await withTimeout(transporter.sendMail(payload), 11000, "SMTP timeout");
}

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
  replyTo?: string;
}) => {
  const { user } = credentials();
  const payload: MailPayload = {
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

  try {
    await sendWith(465, payload);
  } catch (first) {
    transporter = null;
    transporterPort = null;
    try {
      await sendWith(587, payload);
    } catch (second) {
      transporter = null;
      transporterPort = null;
      console.error("SMTP 465 failed:", first);
      console.error("SMTP 587 failed:", second);
      throw second;
    }
  }
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
