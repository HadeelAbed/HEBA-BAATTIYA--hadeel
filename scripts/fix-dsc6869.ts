import { prisma } from "../src/lib/prisma";

async function main() {
  const oldUrl = "/%D8%AA%D8%B9%D8%AF%D9%8A%D9%84%2F%D8%AA%D8%B9%D8%AF%D9%8A%D9%84/%D8%A7%D8%AD%D9%85%D8%B1/DSC_6869%20copy.png";
  const newUrl = oldUrl.replace(".png", ".jpg");
  const res = await prisma.productImage.updateMany({ where: { url: oldUrl }, data: { url: newUrl } });
  console.log("DB updated rows:", res.count);
  const left = await prisma.productImage.count({ where: { url: { contains: "DSC_6869" } } });
  console.log("rows containing DSC_6869:", left);
  await prisma.$disconnect();
}
main();
