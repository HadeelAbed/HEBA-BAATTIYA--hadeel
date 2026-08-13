import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  getTapConfig,
  getTapCharge,
  verifyTapWebhookSignature,
  isTapCaptured,
  TapError,
} from "@/lib/tap";
import { decrementStock } from "@/lib/stock";

// ------------------------------------------------------------------
// Tap Payments webhook — https://<domain>/api/payments/webhook
// Register this URL in your Tap dashboard (Developers -> Webhooks).
//
// Security model (defense in depth):
//   1. The `hashstring` header is verified against the webhook secret
//      (or API key) using Tap's documented HMAC-SHA256 scheme.
//   2. Even after a valid signature, the charge is re-fetched from Tap
//      and the order is only fulfilled when the returned status is
//      CAPTURED and the amount/currency match our Payment record.
//      A forged event would need a real Tap charge id — impossible to
//      guess and impossible to confirm via the re-fetch.
//   3. Fulfilment (marking paid + decrementing stock) is idempotent.
// ------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  if (!rawBody) {
    return NextResponse.json({ error: "Empty body" }, { status: 400 });
  }

  const config = getTapConfig();
  if (!config) {
    // Not configured yet — do not process, tell Tap to stop retrying.
    return NextResponse.json({ ok: false, error: "Not configured" }, { status: 503 });
  }

  const signature = req.headers.get("hashstring") ?? req.headers.get("hash");

  let event: {
    id: string;
    amount: number | string;
    currency: string;
    status: string;
    created?: string | number;
    updated?: string | number;
    metadata?: Record<string, string>;
    reference?: { payment?: string };
  };

  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!event?.id) {
    return NextResponse.json({ error: "Missing charge id" }, { status: 400 });
  }

  const webhookSecret = config.webhookSecret;
  const apiKey = config.secretKey;

  const signatureValid =
    webhookSecret != null
      ? verifyTapWebhookSignature(event, signature, [webhookSecret])
      : verifyTapWebhookSignature(event, signature, [apiKey]);

  // Strict rejection when a webhook secret is configured: the moment the
  // store owner sets TAP_WEBHOOK_SECRET, every request must carry a valid
  // signature. Without one we fall back to the authoritative re-fetch below.
  if (webhookSecret != null && !signatureValid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  // Find the payment that belongs to this charge.
  const payment = await prisma.payment.findUnique({
    where: { tapChargeId: event.id },
    include: { order: true },
  });

  if (!payment) {
    // Not one of our payments — acknowledge and ignore.
    return NextResponse.json({ ok: true, ignored: true });
  }

  if (payment.status === "PAID") {
    // Already fulfilled — idempotent ack.
    return NextResponse.json({ ok: true });
  }

  // ------------------------------------------------------------------
  // Authoritative status check: re-fetch the charge from Tap.
  // Never trust the webhook body alone.
  // ------------------------------------------------------------------
  let charge;
  try {
    charge = await getTapCharge(event.id);
  } catch (err) {
    const status = err instanceof TapError ? err.status : 502;
    // Fail loudly so Tap retries later.
    return NextResponse.json(
      { error: "Could not verify charge status" },
      { status: status === 401 || status === 404 ? 502 : status }
    );
  }

  const chargeStatus = charge.status;
  const amountMatches = Math.abs(Number(charge.amount) - Number(payment.amount)) < 0.01;
  const currencyMatches = (charge.currency || "").toUpperCase() === payment.currency.toUpperCase();

  // Reject/ignore when the re-fetched charge does not belong to this order.
  if (!amountMatches || !currencyMatches) {
    return NextResponse.json({ ok: true, ignored: true, reason: "charge mismatch" });
  }

  // Non-payment terminal states: record them but never confirm the order.
  if (chargeStatus === "FAILED" || chargeStatus === "DECLINED") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED", raw: charge as unknown as Prisma.InputJsonValue },
    });
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "FAILED" },
    });
    return NextResponse.json({ ok: true });
  }

  if (["CANCELLED", "ABANDONED", "VOID", "TIMEDOUT"].includes(chargeStatus)) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "CANCELLED", raw: charge as unknown as Prisma.InputJsonValue },
    });
    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "FAILED" },
    });
    return NextResponse.json({ ok: true });
  }

  if (!isTapCaptured(chargeStatus)) {
    // INITIATED / AUTHORIZED / UNKNOWN — nothing actionable yet.
    return NextResponse.json({ ok: true, pending: true });
  }

  // ------------------------------------------------------------------
  // Payment confirmed (CAPTURED) — fulfil the order exactly once.
  // ------------------------------------------------------------------
  const orderItems = await prisma.orderItem.findMany({
    where: { orderId: payment.orderId },
    select: { productId: true, quantity: true },
  });

  await prisma.$transaction(async (tx) => {
    const current = await tx.payment.findUnique({ where: { id: payment.id } });
    if (current?.status === "PAID") return;

    await decrementStock(orderItems, tx);

    await tx.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: "PAID", status: "CONFIRMED" },
    });

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "PAID",
        paidAt: new Date(),
        tapPaymentId:
          (charge.reference?.payment as string | undefined) ??
          (charge.transaction?.payment_id as string | undefined),
        raw: charge as unknown as Prisma.InputJsonValue,
      },
    });
  });

  return NextResponse.json({ ok: true });
}
