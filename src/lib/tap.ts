// ------------------------------------------------------------------
// Tap Payments v2 client — SERVER ONLY.
// Never import this module from a client component. Secrets are read
// from the environment at request time and are never exposed in any
// API response, page, or log.
//
// Required env vars (set in .env / Vercel):
//   TAP_SECRET_KEY      sk_test_... / sk_live_...
//   TAP_WEBHOOK_SECRET  (optional) secret shown in Tap dashboard webhook settings
//   TAP_BASE_URL        (optional) default https://api.tap.company/v2
// ------------------------------------------------------------------

import { createHmac, timingSafeEqual } from "node:crypto";

const TAP_BASE_URL = process.env.TAP_BASE_URL || "https://api.tap.company/v2";

export class TapError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status = 500) {
    super(message);
    this.name = "TapError";
    this.code = code;
    this.status = status;
  }
}

export function getTapConfig(): { secretKey: string; webhookSecret: string | null; baseUrl: string } | null {
  const secretKey = process.env.TAP_SECRET_KEY;
  if (!secretKey) return null;
  return {
    secretKey,
    webhookSecret: process.env.TAP_WEBHOOK_SECRET || null,
    baseUrl: TAP_BASE_URL,
  };
}

export function isTapConfigured(): boolean {
  return Boolean(process.env.TAP_SECRET_KEY);
}

export interface TapCustomer {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
}

export interface CreateTapChargeInput {
  amount: number; // currency unit (e.g. 1499.75 for 1499.75 SAR)
  currency: string;
  description: string;
  customer: TapCustomer;
  redirectUrl: string;
  metadata: Record<string, string>;
}

export interface TapCharge {
  id: string;
  object?: string;
  status: string;
  amount: number;
  currency: string;
  reference?: { payment?: string; track?: string; transaction?: string };
  transaction?: { url?: string; payment_id?: string };
  metadata?: Record<string, string>;
}

interface TapApiErrorBody {
  errors?: { code?: string; description?: string }[];
  message?: string;
}

async function tapRequest<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const config = getTapConfig();
  if (!config) {
    throw new TapError("Tap payments are not configured.", "NOT_CONFIGURED");
  }

  const res = await fetch(`${config.baseUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      api_token: config.secretKey,
      Authorization: `Bearer ${config.secretKey}`,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = (await res.json().catch(() => ({}))) as Partial<TapCharge> & TapApiErrorBody;

  if (!res.ok) {
    const description = data.errors?.[0]?.description ?? data.message;
    throw new TapError(description ?? `Tap API error (${res.status})`, "API_ERROR", res.status);
  }

  return data as T;
}

export async function createTapCharge(input: CreateTapChargeInput): Promise<TapCharge> {
  const customer = input.customer;
  const payload = {
    amount: input.amount,
    currency: input.currency,
    threeDSecure: true,
    save_card: false,
    description: input.description,
    customer: {
      first_name: customer.firstName,
      last_name: customer.lastName ?? "",
      email: customer.email,
      phone: customer.phone
        ? { country_code: "SA", number: sanitizePhone(customer.phone) }
        : undefined,
    },
    source: { id: "src_all" },
    redirect: { url: input.redirectUrl },
    metadata: input.metadata,
  };

  return tapRequest<TapCharge>("/charges", { method: "POST", body: payload });
}

export async function getTapCharge(chargeId: string): Promise<TapCharge> {
  return tapRequest<TapCharge>(`/charges/${chargeId}`);
}

export function isTapCaptured(status: string): boolean {
  return status === "CAPTURED";
}

// ------------------------------------------------------------------
// Webhook signature verification.
// Tap signs charge webhooks with HMAC-SHA256 (hex or base64) of:
//   x_id{id}x_amount{amount}x_currency{currency}x_updated{updated}
//   x_status{status}x_created{created}
// using the API secret key (or the webhook secret if you set one).
// ------------------------------------------------------------------

export interface TapWebhookChargeEvent {
  id: string;
  object?: string;
  amount: number | string;
  currency: string;
  status: string;
  created?: string | number;
  updated?: string | number;
  metadata?: Record<string, string>;
  reference?: { payment?: string; track?: string; transaction?: string };
}

export function verifyTapWebhookSignature(
  event: TapWebhookChargeEvent,
  signature: string | null,
  secrets: string[]
): boolean {
  if (!signature || secrets.length === 0) return false;

  const toHash = `x_id${event.id}x_amount${event.amount}x_currency${event.currency}x_updated${event.updated ?? ""}x_status${event.status}x_created${event.created ?? ""}`;

  for (const secret of secrets) {
    const digest = createHmac("sha256", secret).update(toHash).digest();
    if (safeEqualHex(digest.toString("hex"), signature)) return true;
    if (safeEqualHex(digest.toString("base64"), signature)) return true;
  }
  return false;
}

function safeEqualHex(expected: string, provided: string): boolean {
  if (!provided) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function sanitizePhone(phone: string): string {
  const digits = phone.replace(/[^0-9]/g, "");
  return digits.replace(/^0/, "").replace(/^966/, "");
}
