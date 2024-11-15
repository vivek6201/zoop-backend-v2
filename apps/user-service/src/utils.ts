import { IncomingHttpHeaders } from "http";

export const tokenExtractor = (headers: IncomingHttpHeaders) => {
    const token = headers.token as string; 
    return JSON.parse(token);
}

const CART = "cart/";

export const CART_EXPIRY = 60 * 60 * 24;

export const getCartKey = (userId: string) => `${CART}${userId}`;