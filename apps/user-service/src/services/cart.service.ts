import { cache } from "@repo/service-config/src";
import { CART_EXPIRY, getCartKey } from "../utils";
import prisma from "@repo/db/src";
import { Cart, CartItem } from "../types"

export const cartService = () => {
  //get cart
  const getCart = async (userProfileId: string): Promise<Cart | null> => {
    const cachedCart = await cache.get(getCartKey(userProfileId));

    if (cachedCart) return cachedCart;

    //find in db
    let dbCart: Cart | null = null;

    try {
      dbCart = (await prisma.userCart.findUnique({
        where: {
          userProfileId,
        },
      })) as (Cart & { metadata: { items: CartItem[]; total: number } }) | null;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to find cart inside db!");
    }

    if (dbCart) {
      await cache.set(getCartKey(userProfileId), dbCart, CART_EXPIRY);

      return {
        ...dbCart,
        metadata: dbCart.metadata as unknown as {
          items: CartItem[];
          total: number;
        },
      };
    }

    return null;
  };

  const syncWithDB = async (cart: Cart) => {
    await prisma.userCart.upsert({
      where: { userProfileId: cart.userProfileId },
      update: {
        metadata: JSON.stringify(cart.metadata),
        updatedAt: cart.updatedAt,
      },
      create: {
        userProfileId: cart.userProfileId,
        metadata: JSON.stringify(cart.metadata),
      },
    });
  };

  const updateCart = async (
    userProfileId: string,
    items: CartItem[]
  ): Promise<Cart | Error> => {
    const cart: Cart = {
      metadata: {
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      },
      updatedAt: new Date(),
      userProfileId: userProfileId,
    };

    await cache.set(getCartKey(userProfileId), cart, CART_EXPIRY);

    try {
      await syncWithDB(cart);
      return cart;
    } catch (error) {
      console.error("Failed to sync with db!", error);
    }

    throw new Error("Cart created, but failed to sync with db!");
  };

  //replace this checkout with payment service i.e do these actions as per payments
  //if payment is cod proceed with order creation and when the order is created then
  //delete the cart.
  const checkout = async (userProfileId: string) => {
    const cart = await getCart(userProfileId);

    if (!cart) return;

    try {
      await syncWithDB(cart);
    } catch (error) {
      console.error("failed to sync with db!", error);
      throw new Error("Failed to sync with db!");
    }

    await cache.del(getCartKey(userProfileId));
  };

  return { checkout, getCart, updateCart };
};
