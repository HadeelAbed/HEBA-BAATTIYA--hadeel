import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");

  if (key) {
    const content = await prisma.siteContent.findUnique({ where: { key } });
    return NextResponse.json({ content: content ? JSON.parse(content.value) : null });
  }

  const all = await prisma.siteContent.findMany();
  return NextResponse.json({
    content: Object.fromEntries(all.map((c) => [c.key, JSON.parse(c.value)])),
  });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes((session.user as { role?: string }).role ?? "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { key, value } = await req.json();
  if (!key) return NextResponse.json({ error: "key is required" }, { status: 400 });

  const content = await prisma.siteContent.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });

  return NextResponse.json({ content });
}
