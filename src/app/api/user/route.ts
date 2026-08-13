import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim().slice(0, 100) : undefined;
  const lastName =
    typeof body.lastName === "string" ? body.lastName.trim().slice(0, 100) : undefined;
  const phone = typeof body.phone === "string" ? body.phone.trim().slice(0, 50) : undefined;

  if (firstName === undefined && lastName === undefined && phone === undefined) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      firstName,
      lastName,
      name: [firstName, lastName].filter(Boolean).join(" ") || undefined,
      phone,
    },
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  return NextResponse.json({ user });
}
