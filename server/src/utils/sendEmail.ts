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

export function mailConfigured(): boolean {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = String(process.env.EMAIL_PASS || "").replace(/\s/g, "");
  return Boolean(user && pass);
}

function credentials() {
  const user = String(process.env.EMAIL_USER || "").trim();
  const pass = String(process.env.EMAIL_PASS || "").replace(/\s/g, "");
  if (!user || !pass) {
    throw new Error("EMAIL_USER ან EMAIL_PASS აკლია Render Environment-ში");
  }
  return { user, pass };
}

function transports() {
  const { user, pass } = credentials();
  const auth = { user, pass };
  const timeouts = {
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 25000,
    family: 4 as const,
  };
  return [
    nodemailer.createTransport({
      service: "gmail",
      auth,
      ...timeouts,
    }),
    nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth,
      ...timeouts,
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
  for (const transporter of transports()) {
    try {
      await transporter.sendMail(payload);
      console.log("SMTP sent", { to: options.email, from: user });
      return;
    } catch (err) {
      console.error("SMTP attempt failed", err);
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
    hint:
      pass.length !== 16
        ? "Gmail-ის App Password ჩვეულებრივ 16 სიმბოლოა (არა ანგარიშის პაროლი)"
        : "შეამოწმე 2FA + App Password და რომ EMAIL_USER არის იგივე Gmail",
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
