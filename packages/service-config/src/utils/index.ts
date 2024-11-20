import { IncomingHttpHeaders } from "http";

export const tokenExtractor = (headers: IncomingHttpHeaders) => {
  const token = headers.token as string;
  return JSON.parse(token);
};

enum Keys {
  CART = "cart",
  RESTRAUNT = "restraunt",
}

export const getCartKey = (userId?: string) => `${Keys.CART}/${userId}`;

type RestrauntKeyType = "ALL" | "MENU" | "DETAILS";

export const getRestrauntKeys = (
  type: RestrauntKeyType,
  profileId?: string
) => {
  const restraunt = "restraunt";
  switch (type) {
    case "MENU":
      return `${restraunt}/${profileId}-menu`;
    case "ALL":
      return `${restraunt}/all`;
    case "DETAILS":
      return `${restraunt}/${profileId}-details`;
  }
};
type FoodKeytype = "CATEGORIES" | "DISHES";

export const getFoodKeys = (type: FoodKeytype, menuId?: string) => {
  const restraunt = "restraunt";
  switch (type) {
    case "CATEGORIES":
      return `${restraunt}/${menuId}-categories`;
    case "DISHES":
      return `${restraunt}/${menuId}-dishes`;
  }
};

export enum OrderKey {
  VENDOR_ORDERS = "VENDOR_ORDERS",
  USER_ORDERS = "USER_ORDERS",
}

export const getOrdersKey = (type: OrderKey, orderId?: string) => {
  switch (type) {
    case OrderKey.USER_ORDERS:
      return `orders/user/${orderId}`;
    case OrderKey.VENDOR_ORDERS:
      return `orders/vendor/${orderId}`;
    default:
      throw new Error(`Invalid order key type: ${type}`);
  }
};

export const getProductKey = (productId: string) => `products/${productId}`;
