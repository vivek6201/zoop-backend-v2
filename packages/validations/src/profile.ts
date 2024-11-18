import { z } from "zod";

export const adminProfileSchema = z.object({});

export const userProfileSchema = z.object({
  phoneNumber: z.number().min(10),
  address: z.string().min(3),
  dob: z.preprocess((arg) => {
    if (typeof arg === "string" || arg instanceof Date) {
      return new Date(arg);
    }
    return arg;
  }, z.date()),
});

export const vendorProfileSchema = z.object({
  bussinessName: z.string().min(3),
  bussinessAddress: z.string().min(3),
  phoneNumber: z.number().min(10),
});

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
});

export const updateCartSchema = z.object({
  items: z
    .array(cartItemSchema)
    .min(1, "Cart can't be empty")
    .max(20, "Too many items in cart"),
  vendorProfileId: z.string().uuid()
});

export const checkoutSchema = z.object({
  paymentType: z.enum(["PREPAID", "COD"]),
});

export const deliveryProfileSchema = z.object({});
