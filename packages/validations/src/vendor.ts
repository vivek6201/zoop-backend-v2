import { z } from "zod";

export const dishCategorySchema = z.object({
  categoryName: z.string().min(3),
});

export const vendorDishSchema = z.object({
  dishName: z.string().min(3, "Dish name must be at least 3 characters long"),
  dishPrice: z.number().min(1, "Dish price must be at least 1"),
  dishRating: z.number().min(0).max(5).default(0),
  dishImage: z
    .any()
    .optional()
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "Max file size is 5MB"
    )
    .refine(
      (file) =>
        !file ||
        [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/heic",
        ].includes(file.mimetype),
      "Only .jpeg, .png, webp, heic and .gif formats are supported"
    ),
  dishDescription: z.string().min(1, "Dish description is required"),
  dishCategoryId: z.string().min(1).optional(),
});
