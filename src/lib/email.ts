import nodemailer from "nodemailer";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const configured =
  !!process.env.EMAIL_SERVER_HOST &&
  !!process.env.EMAIL_SERVER_USER &&
  !!process.env.EMAIL_SERVER_PASSWORD;

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter && configured) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT ?? 587),
      secure: Number(process.env.EMAIL_SERVER_PORT ?? 587) === 465,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  }
  return transporter;
}

/**
 * Sends an email via SMTP. If SMTP is not configured (dev mode),
 * logs the email body to the server console so flows can still be tested.
 * Returns `true` if actually sent, `false` if it fell back to console.
 */
export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const from = process.env.EMAIL_FROM ?? "no-reply@hebabaattiya.com";

  if (!configured) {
    console.log("\n[dev-email] To: " + payload.to);
    console.log("[dev-email] Subject: " + payload.subject);
    console.log("[dev-email] Body:\n" + (payload.text ?? payload.html.replace(/<[^>]+>/g, " ")));
    console.log("[dev-email] (EMAIL_SERVER_HOST not set — configure SMTP to send real mail)\n");
    return false;
  }

  const t = getTransporter();
  if (!t) return false;

  await t.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
  return true;
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}
