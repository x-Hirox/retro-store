import crypto from "crypto";
import { frontendBaseUrl } from "./sendEmail.js";

export type PayMethod = "card" | "cash" | "apple_pay" | "google_pay";
export type PaymentProvider = "tbc" | "bog";

const TBC_API = "https://api.tbcbank.ge/v1/tpay";
const BOG_AUTH =
  "https://oauth2.bog.ge/auth/realms/bog/protocol/openid-connect/token";
const BOG_API = "https://api.bog.ge/payments/v1";

const BOG_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu4RUyAw3+CdkS3ZNILQh
zHI9Hemo+vKB9U2BSabppkKjzjjkf+0Sm76hSMiu/HFtYhqWOESryoCDJoqffY0Q
1VNt25aTxbj068QNUtnxQ7KQVLA+pG0smf+EBWlS1vBEAFbIas9d8c9b9sSEkTrr
TYQ90WIM8bGB6S/KLVoT1a7SnzabjoLc5Qf/SLDG5fu8dH8zckyeYKdRKSBJKvhx
tcBuHV4f7qsynQT+f2UYbESX/TLHwT5qFWZDHZ0YUOUIvb8n7JujVSGZO9/+ll/g
4ZIWhC1MlJgPObDwRkRd8NFOopgxMcMsDIZIoLbWKhHVq67hdbwpAq9K9WMmEhPn
PwIDAQAB
-----END PUBLIC KEY-----`;

let tbcToken = "";
let tbcTokenExp = 0;
let bogToken = "";
let bogTokenExp = 0;

export function publicApiBase() {
  return (
    process.env.BACKEND_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    "https://retro-store.onrender.com"
  ).replace(/\/$/, "");
}

export function tbcReady() {
  return Boolean(
    process.env.TBC_API_KEY &&
      process.env.TBC_CLIENT_ID &&
      process.env.TBC_CLIENT_SECRET,
  );
}

export function bogReady() {
  return Boolean(process.env.BOG_CLIENT_ID && process.env.BOG_CLIENT_SECRET);
}

export function activeProvider(): PaymentProvider | null {
  const forced = String(process.env.PAYMENT_PROVIDER || "auto").toLowerCase();
  if (forced === "tbc" && tbcReady()) return "tbc";
  if (forced === "bog" && bogReady()) return "bog";
  if (tbcReady()) return "tbc";
  if (bogReady()) return "bog";
  return null;
}

export function bankConfigured() {
  return activeProvider() !== null;
}

async function readJson(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
}

async function tbcAccessToken() {
  if (tbcToken && Date.now() < tbcTokenExp) return tbcToken;
  const body = new URLSearchParams({
    client_id: process.env.TBC_CLIENT_ID || "",
    client_secret: process.env.TBC_CLIENT_SECRET || "",
  });
  const res = await fetch(`${TBC_API}/access-token`, {
    method: "POST",
    headers: {
      apikey: process.env.TBC_API_KEY || "",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await readJson(res);
  if (!res.ok || !data.access_token) {
    throw new Error(data.title || data.error || "TBC token failed");
  }
  tbcToken = String(data.access_token);
  tbcTokenExp = Date.now() + Math.max(60, Number(data.expires_in || 3600) - 60) * 1000;
  return tbcToken;
}

async function bogAccessToken() {
  if (bogToken && Date.now() < bogTokenExp) return bogToken;
  const basic = Buffer.from(
    `${process.env.BOG_CLIENT_ID}:${process.env.BOG_CLIENT_SECRET}`,
  ).toString("base64");
  const res = await fetch(BOG_AUTH, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  const data = await readJson(res);
  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description || data.error || "BOG token failed");
  }
  bogToken = String(data.access_token);
  bogTokenExp = Date.now() + Math.max(60, Number(data.expires_in || 3600) - 60) * 1000;
  return bogToken;
}

function tbcMethods(method: PayMethod): number[] {
  if (method === "apple_pay") return [9, 5];
  if (method === "google_pay") return [14, 5];
  return [5];
}

function bogMethods(method: PayMethod): string[] {
  if (method === "apple_pay") return ["apple_pay", "card"];
  if (method === "google_pay") return ["google_pay", "card"];
  return ["card"];
}

export async function createBankPayment(opts: {
  orderId: string;
  amount: number;
  method: PayMethod;
  origin?: string | string[] | undefined;
  items: Array<{ id: string; title: string; quantity: number; price: number }>;
}): Promise<{ provider: PaymentProvider; bankPaymentId: string; redirectUrl: string }> {
  const provider = activeProvider();
  if (!provider) {
    throw new Error("ბანკის გადახდა არ არის გამართული");
  }
  const frontend = frontendBaseUrl(opts.origin);
  const api = publicApiBase();
  const returnUrl = `${api}/api/payments/return/${opts.orderId}`;
  const amount = Math.round(opts.amount * 100) / 100;

  if (provider === "tbc") {
    const token = await tbcAccessToken();
    const res = await fetch(`${TBC_API}/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.TBC_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: { currency: "GEL", total: amount, subTotal: amount, tax: 0, shipping: 0 },
        returnurl: returnUrl,
        callbackUrl: `${api}/api/payments/tbc/callback`,
        language: "KA",
        merchantPaymentId: crypto.randomUUID().replace(/-/g, "").slice(0, 24),
        expirationMinutes: 12,
        skipInfoMessage: true,
        methods: tbcMethods(opts.method),
        extra: "RETROBIT",
      }),
    });
    const data = await readJson(res);
    if (!res.ok) {
      throw new Error(data.detail || data.title || "TBC payment create failed");
    }
    const payId = String(data.payId || data.paymentId || "");
    const links = Array.isArray(data.links) ? data.links : [];
    const approve = links.find(
      (link: { rel?: string; uri?: string; href?: string }) =>
        String(link.rel || "").toLowerCase().includes("approval"),
    );
    const redirectUrl = String(
      approve?.uri || approve?.href || data.redirectUrl || "",
    );
    if (!payId || !redirectUrl) {
      throw new Error("TBC-მ გადახდის ბმული არ დააბრუნა");
    }
    return { provider, bankPaymentId: payId, redirectUrl };
  }

  const token = await bogAccessToken();
  const res = await fetch(`${BOG_API}/ecommerce/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Accept-Language": "ka",
      "Idempotency-Key": crypto.randomUUID(),
    },
    body: JSON.stringify({
      callback_url: `${api}/api/payments/bog/callback`,
      external_order_id: `${opts.orderId}:${Date.now()}`,
      capture: "automatic",
      purchase_units: {
        currency: "GEL",
        total_amount: amount,
        basket: opts.items.map((item) => ({
          product_id: item.id.slice(-24),
          description: item.title.slice(0, 80),
          quantity: item.quantity,
          unit_price: item.price,
        })),
      },
      redirect_urls: { success: returnUrl, fail: `${returnUrl}?pay=fail` },
      payment_method: bogMethods(opts.method),
    }),
  });
  const data = await readJson(res);
  if (!res.ok) {
    throw new Error(data.message || data.title || "BOG payment create failed");
  }
  const bankPaymentId = String(data.id || data.order_id || "");
  const redirectUrl = String(data._links?.redirect?.href || "");
  if (!bankPaymentId || !redirectUrl) {
    throw new Error("BOG-მა გადახდის ბმული არ დააბრუნა");
  }
  return { provider, bankPaymentId, redirectUrl };
}

function mapTbcStatus(status: string): "paid" | "failed" | "pending" {
  const s = status.toLowerCase();
  if (["succeeded", "succeed", "completed", "finished", "ok"].includes(s)) {
    return "paid";
  }
  if (["failed", "expired", "cancelled", "canceled", "declined", "error"].includes(s)) {
    return "failed";
  }
  return "pending";
}

function mapBogStatus(status: string): "paid" | "failed" | "pending" {
  const s = status.toLowerCase();
  if (["completed", "success", "captured", "partial_completed"].includes(s)) {
    return "paid";
  }
  if (["rejected", "refunded", "failed", "expired", "cancelled"].includes(s)) {
    return "failed";
  }
  return "pending";
}

export async function fetchTbcStatus(payId: string): Promise<"paid" | "failed" | "pending"> {
  const token = await tbcAccessToken();
  const res = await fetch(`${TBC_API}/payments/${encodeURIComponent(payId)}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: process.env.TBC_API_KEY || "",
    },
  });
  const data = await readJson(res);
  if (!res.ok) return "pending";
  return mapTbcStatus(String(data.status || data.Status || ""));
}

export async function fetchBogStatus(bankOrderId: string): Promise<"paid" | "failed" | "pending"> {
  const token = await bogAccessToken();
  const res = await fetch(`${BOG_API}/receipt/${encodeURIComponent(bankOrderId)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await readJson(res);
  if (!res.ok) return "pending";
  const key = String(
    data.order_status?.key || data.status || data.payment_status || "",
  );
  return mapBogStatus(key);
}

export function verifyBogSignature(rawBody: Buffer, signature: string) {
  if (!signature) return false;
  try {
    const verifier = crypto.createVerify("SHA256");
    verifier.update(rawBody);
    verifier.end();
    return verifier.verify(BOG_PUBLIC_KEY, signature, "base64");
  } catch {
    return false;
  }
}

export function shopReturnUrl(orderId: string, origin?: string | string[], pay?: string) {
  const q = pay ? `?pay=${encodeURIComponent(pay)}` : "";
  return `${frontendBaseUrl(origin)}/order-success/${orderId}${q}`;
}
