import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface StockLine {
  productId: string;
  quantity: number;
}

type DbClient = PrismaClient | Prisma.TransactionClient;

/**
 * Decrements stock from the highest-stock variant of each product.
 * Used for COD orders at checkout time and for card orders only once
 * the payment is confirmed (see webhook handler), so stock is never
 * reserved for unpaid orders.
 */
export async function decrementStock(lines: StockLine[], client: DbClient = prisma): Promise<void> {
  for (const line of lines) {
    const variants = await client.productVariant.findMany({
      where: { productId: line.productId },
      orderBy: { stock: "desc" },
    });
    if (variants.length > 0) {
      await client.productVariant.update({
        where: { id: variants[0].id },
        data: { stock: { decrement: line.quantity } },
      });
    }
  }
}
