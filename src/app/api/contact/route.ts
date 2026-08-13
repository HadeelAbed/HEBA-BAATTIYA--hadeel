import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }

  const message = await prisma.contactMessage.create({ data: parsed.data });

  // In production: notify the concierge team, e.g. via an email service
  // (Resend, SendGrid, etc.) using EMAIL_* env vars from .env.example.

  return NextResponse.json({ message }, { status: 201 });
}
