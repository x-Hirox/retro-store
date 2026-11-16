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

export function frontendBaseUrl(origin?: string): string {
  const configured = process.env.FRONTEND_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (origin?.startsWith("http")) return origin.replace(/\/$/, "");
  return process.env.NODE_ENV === "production"
    ? "https://retrobit.ge"
    : "http://127.0.0.1:5173";
}

let transporter: nodemailer.Transporter | null = null;

function mailer() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;
  if (!user || !pass) {
    throw new Error("EMAIL_USER ან EMAIL_PASS აკლია server/.env-ში");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }
  return transporter;
}

export const sendEmail = async (options: {
  email: string;
  subject: string;
  message: string;
  html?: string;
  replyTo?: string;
}) => {
  const from = shopMail();
  await mailer().sendMail({
    from: `"RetroBit" <${from}>`,
    to: options.email,
    replyTo: options.replyTo || from,
    subject: options.subject,
    text: options.message,
    html:
      options.html ||
      `<pre style="font-family:sans-serif;white-space:pre-wrap">${options.message
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</pre>`,
  });
};
