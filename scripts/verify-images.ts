import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

const PUBLIC = "D:/موقع سعودي/heba-baattiya/heba-baattiya/public";

async function main() {
  // 1. Check DB doesn't reference deleted files (uploads/, viedo/, hawks, root Black_)
  const products = await prisma.product.findMany({ select: { id: true, name: true, images: { select: { url: true } } } });
  const cats = await prisma.category.findMany({ select: { image: true } });
  const contents = await prisma.siteContent.findMany();
  const suspicious: string[] = [];
  const jsonBlob = JSON.stringify(products) + JSON.stringify(cats) + JSON.stringify(contents);
  for (const t of ["uploads", "viedo", "hawks", "favicon", "Black_1", "Black_2", "Black_4", "map.html", "Shortcut"]) {
    if (jsonBlob.includes(t)) suspicious.push(t);
  }
  console.log("Suspicious DB refs:", suspicious.length ? suspicious.join(", ") : "NONE");

  // 2. Verify all DB product images exist on disk
  let missing = 0;
  for (const p of products) {
    for (const img of p.images) {
      const rel = decodeURIComponent(img.url.replace(/^\//, ""));
      if (!fs.existsSync(path.join(PUBLIC, rel))) {
        missing++;
        console.log("MISSING:", img.url, "->", rel);
      }
    }
  }
  console.log("Missing DB-referenced images:", missing);

  // 3. Total public size now
  let size = 0;
  let files = 0;
  function walk(d: string) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) walk(p);
      else { size += fs.statSync(p).size; files++; }
    }
  }
  walk(PUBLIC);
  console.log("public size now:", (size / 1024 / 1024).toFixed(1), "MB,", files, "files");

  // 4. State of DSC_6869 (was png, converted?)
  const pngPath = path.join(PUBLIC, decodeURIComponent("%D8%AA%D8%B9%D8%AF%D9%8A%D9%84%2F%D8%AA%D8%B9%D8%AF%D9%8A%D9%84/%D8%A7%D8%AD%D9%85%D8%B1/DSC_6869%20copy.png".replace(/^\//, "")));
  console.log("DSC_6869 copy.png exists:", fs.existsSync(pngPath), fs.existsSync(pngPath) ? (fs.statSync(pngPath).size / 1024).toFixed(0) + "KB" : "");
  if (fs.existsSync(pngPath)) {
    const head = fs.readFileSync(pngPath).subarray(0, 3).toString("hex");
    console.log("DSC_6869 first bytes:", head, head === "ffd8ff" ? "(JPEG data!)" : "");
  }
  await prisma.$disconnect();
}
main();
