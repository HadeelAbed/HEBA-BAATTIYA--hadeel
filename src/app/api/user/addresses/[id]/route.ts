import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

async function getOwnedAddress(userId: string, id: string) {
  return prisma.address.findFirst({ where: { id, userId } });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedAddress(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  const body = await req.json();
  const data: Record<string, string | boolean | undefined> = {};

  for (const key of ["label", "fullName", "phone", "country", "city", "line1", "line2", "postalCode"] as const) {
    if (typeof body[key] === "string") {
      const value = body[key].trim().slice(0, key === "line1" || key === "line2" ? 200 : 100);
      data[key] = key === "label" || key === "line2" ? value || undefined : value;
    }
  }

  if (body.isDefault === true) {
    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });
    data.isDefault = true;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const address = await prisma.address.update({ where: { id }, data });

  return NextResponse.json({
    address: {
      id: address.id,
      label: address.label ?? undefined,
      fullName: address.fullName,
      phone: address.phone,
      country: address.country,
      city: address.city,
      line1: address.line1,
      line2: address.line2 ?? undefined,
      postalCode: address.postalCode,
      isDefault: address.isDefault,
    },
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await getOwnedAddress(session.user.id, id);
  if (!existing) {
    return NextResponse.json({ error: "Address not found." }, { status: 404 });
  }

  await prisma.address.delete({ where: { id } });

  if (existing.isDefault) {
    const next = await prisma.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "asc" },
    });
    if (next) {
      await prisma.address.update({ where: { id: next.id }, data: { isDefault: true } });
    }
  }

  return NextResponse.json({ ok: true });
}
