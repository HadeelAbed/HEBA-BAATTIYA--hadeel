import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail, siteUrl } from "@/lib/email";
import { z } from "zod";

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = forgotSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message ?? "Invalid input" }, { status: 400 });
    }

    const email = parsed.data.email.toLowerCase().trim();

    // Always succeed — never reveal whether an account exists.
    const user = await prisma.user.findUnique({ where: { email } });
    let devLink: string | null = null;

    if (user && user.password) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await prisma.passwordResetToken.deleteMany({ where: { email } });
      await prisma.passwordResetToken.create({ data: { email, token, expires } });

      const link = `${siteUrl()}/reset-password?token=${token}`;
      devLink = link;

      const sent = await sendEmail({
        to: email,
        subject: "Reset your password — Heba Baattiya",
        text: `We received a request to reset your password. Use the link below (valid for 1 hour):\n\n${link}\n\nIf you didn't request this, you can safely ignore this email.`,
        html: `
          <div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#1a1a1a">Reset your password</h2>
            <p style="color:#555;line-height:1.6">We received a request to reset your Heba Baattiya password. This link is valid for <strong>1 hour</strong>.</p>
            <p style="margin:24px 0">
              <a href="${link}" style="background:#1a1a1a;color:#fff;text-decoration:none;padding:12px 24px;display:inline-block;border-radius:2px">Reset password</a>
            </p>
            <p style="color:#888;font-size:13px">If the button doesn't work, copy and paste this link into your browser:<br/><span style="color:#555">${link}</span></p>
            <p style="color:#888;font-size:13px;line-height:1.6">If you didn't request this, you can safely ignore this email.</p>
          </div>`,
      });

      // Only expose the link when the email was NOT actually sent (no SMTP configured).
      devLink = sent ? null : link;
    }

    return NextResponse.json({ ok: true, ...(devLink ? { devLink } : {}) });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
