import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({
    addresses: addresses.map((a) => ({
      id: a.id,
      label: a.label ?? undefined,
      fullName: a.fullName,
      phone: a.phone,
      country: a.country,
      city: a.city,
      line1: a.line1,
      line2: a.line2 ?? undefined,
      postalCode: a.postalCode,
      isDefault: a.isDefault,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const required = ["fullName", "phone", "country", "city", "line1", "postalCode"];
  for (const key of required) {
    if (typeof body[key] !== "string" || !body[key].trim()) {
      return NextResponse.json({ error: `${key} is required.` }, { status: 400 });
    }
  }

  const count = await prisma.address.count({ where: { userId: session.user.id } });
  const makeDefault = count === 0;

  const address = await prisma.address.create({
    data: {
      userId: session.user.id,
      label: typeof body.label === "string" ? body.label.trim().slice(0, 50) || undefined : undefined,
      fullName: body.fullName.trim().slice(0, 100),
      phone: body.phone.trim().slice(0, 50),
      country: body.country.trim().slice(0, 100),
      city: body.city.trim().slice(0, 100),
      line1: body.line1.trim().slice(0, 200),
      line2: typeof body.line2 === "string" && body.line2.trim() ? body.line2.trim().slice(0, 200) : undefined,
      postalCode: body.postalCode.trim().slice(0, 20),
      isDefault: makeDefault,
    },
  });

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
