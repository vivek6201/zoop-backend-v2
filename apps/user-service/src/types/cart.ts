import { cartItemSchema, z } from "@repo/validations/src";

export type CartItem = z.infer<typeof cartItemSchema>;

export interface Cart {
  userProfileId: string;
  metadata: {
    items: CartItem[];
    total: number;
  };
  updatedAt: Date;
}
