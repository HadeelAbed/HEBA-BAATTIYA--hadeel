import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  const path = join(process.cwd(), "public", "uploads", filename);

  await writeFile(path, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
