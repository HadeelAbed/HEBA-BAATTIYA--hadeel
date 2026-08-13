import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { mapProduct } from "@/lib/queries";
import type { CartLine } from "@/lib/store/cart-store";

const CART_COOKIE = "hb_cart";

export type CartOwner = { userId: string | null; sessionId: string | null };

async function getCartOwner(): Promise<CartOwner> {
  const session = await auth();
  if (session?.user?.id) {
    return { userId: session.user.id, sessionId: null };
  }

  const store = await cookies();
  let sessionId = store.get(CART_COOKIE)?.value;
  if (!sessionId) {
    sessionId = randomUUID();
    store.set(CART_COOKIE, sessionId, {
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }
  return { userId: null, sessionId };
}

function clearCartCookie() {
  cookies().then((store) => {
    store.set(CART_COOKIE, "", { path: "/", maxAge: 0 });
  });
}

export async function resolveCart() {
  const owner = await getCartOwner();
  const { userId, sessionId } = owner;

  if (userId) {
    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId } });

      // Merge any guest cart (from the session cookie) into the signed-in cart
      if (sessionId) {
        const guestCart = await prisma.cart.findUnique({
          where: { sessionId },
          include: { items: true },
        });
        if (guestCart) {
          for (const item of guestCart.items) {
            await prisma.cartItem.upsert({
              where: {
                cartId_productId_colorName_sizeLabel: {
                  cartId: cart.id,
                  productId: item.productId,
                  colorName: item.colorName,
                  sizeLabel: item.sizeLabel,
                },
              },
              update: { quantity: { increment: item.quantity } },
              create: {
                cartId: cart.id,
                productId: item.productId,
                colorName: item.colorName,
                sizeLabel: item.sizeLabel,
                quantity: item.quantity,
              },
            });
          }
          await prisma.cart.delete({ where: { id: guestCart.id } });
          clearCartCookie();
        }
      }
    }
    return { cart, owner };
  }

  let cart = sessionId
    ? await prisma.cart.findUnique({ where: { sessionId } })
    : null;
  if (!cart) {
    cart = await prisma.cart.create({ data: { sessionId: sessionId ?? randomUUID() } });
  }
  return { cart, owner };
}

export async function serializeCart(cartId: string): Promise<CartLine[]> {
  const items = await prisma.cartItem.findMany({
    where: { cartId },
    include: {
      product: {
        include: {
          category: true,
          images: { orderBy: { sortOrder: "asc" } },
          colors: true,
          sizes: { orderBy: { sortOrder: "asc" } },
          variants: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  return items.map((item) => {
    const product = mapProduct(item.product);
    return {
      lineId: item.id,
      productId: item.productId,
      product,
      colorName: item.colorName || undefined,
      sizeLabel: item.sizeLabel || undefined,
      quantity: item.quantity,
    };
  });
}
