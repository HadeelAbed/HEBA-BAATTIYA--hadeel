import { prisma } from "../src/lib/prisma";

async function main() {
  const cats = await prisma.category.findMany({ select: { id: true, name: true, image: true } });
  const items = await prisma.orderItem.findMany({ select: { productImage: true } });
  const products = await prisma.product.findMany({ select: { id: true, images: { select: { url: true } } } });
  console.log("=== Categories ===");
  cats.forEach((c) => console.log(JSON.stringify(c)));
  console.log("=== Products (images) ===");
  products.forEach((p) => console.log(p.id, JSON.stringify(p.images.map((i) => i.url))));
  console.log("=== OrderItem productImage (unique) ===");
  console.log([...new Set(items.map((i) => i.productImage).filter(Boolean))].join("\n"));
  await prisma.$disconnect();
}
main();
