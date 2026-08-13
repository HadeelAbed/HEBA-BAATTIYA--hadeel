import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

async function main() {
  const images = await prisma.productImage.findMany({ select: { url: true } });
  const publicDir = "D:/موقع سعودي/heba-baattiya/heba-baattiya/public";
  const byExt: Record<string, number> = {};
  let missing = 0;
  const missingFiles: string[] = [];
  let totalMb = 0;
  for (const img of images) {
    const clean = img.url.startsWith("/") ? img.url.slice(1) : img.url;
    const decoded = decodeURIComponent(clean);
    const ext = path.extname(clean).toLowerCase();
    byExt[ext] = (byExt[ext] || 0) + 1;
    const full = path.join(publicDir, decoded);
    if (!fs.existsSync(full)) {
      missing++;
      missingFiles.push(img.url);
    } else {
      totalMb += fs.statSync(full).size / 1024 / 1024;
    }
  }
  console.log("DB images: " + images.length);
  console.log("By extension: " + JSON.stringify(byExt));
  console.log("Missing files: " + missing + (missing ? "\n" + missingFiles.join("\n") : ""));
  console.log("Total size of DB-referenced images: " + totalMb.toFixed(1) + " MB");
  await prisma.$disconnect();
}
main();
