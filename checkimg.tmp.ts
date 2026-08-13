import { PrismaClient } from "@prisma/client";

async function main() {
  const p = new PrismaClient();
  const imgs = await p.productImage.findMany({ select: { url: true } });
  const urls = imgs.map((i) => i.url);
  const single = urls.filter((u) => u.includes("/تعديل/") && !u.includes("/تعديل/تعديل/"));
  const broken = single.filter((u) => {
    const rel = u.split("/").filter(Boolean).join("/");
    return false;
  });
  console.log("total images:", urls.length);
  console.log("with single /تعديل/ (likely broken):", single.length);
  const samples = [...new Set(single)].slice(0, 5);
  console.log("samples:", JSON.stringify(samples));
  const distinct = [...new Set(urls)];
  console.log("all distinct urls:");
  for (const u of distinct) console.log(" -", u);
  await p.$disconnect();
}

main();
