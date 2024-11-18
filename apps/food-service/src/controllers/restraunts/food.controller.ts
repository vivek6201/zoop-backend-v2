import prisma, { DishCategory, VendorDish } from "@repo/db/src";
import { cache, getFoodKeys } from "@repo/service-config/src";
import { Request, RequestHandler, Response } from "express";
import { STATUS_CODES } from "../../constants/statusCodes";
import { dishCategorySchema, vendorDishSchema, z } from "@repo/validations/src";

export const getAllCategoriesController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { menuId: vendorMenuId } = req.params;

  let categories: DishCategory[] = [];

  try {
    categories = await cache.get(getFoodKeys("CATEGORIES", vendorMenuId));

    if (categories) {
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "categories fetched successfully!",
        data: categories,
      });
      return;
    }
  } catch (error) {
    console.error(
      "Error occurred while fetching categories from cache!",
      error
    );
  }

  try {
    categories = await prisma.dishCategory.findMany({
      where: {
        vendorMenuId,
      },
    });
    cache.set(getFoodKeys("CATEGORIES", vendorMenuId), categories, 1500);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Categories fetched successfully from db!",
      data: categories,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching categories data from db!",
    });
  }
};

export const getAllDishesController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { menu: vendorMenuId } = req.params;

  let dishes: VendorDish[] = [];

  try {
    dishes = await cache.get(getFoodKeys("DISHES", vendorMenuId));

    if (dishes) {
      res.status(STATUS_CODES.SUCCESS).json({
        success: true,
        message: "dishes fetched successfully from cache!",
        data: dishes,
      });
      return;
    }
  } catch (error) {
    console.error("Error while fetching data from the cache", error);
  }

  try {
    dishes = await prisma.vendorDish.findMany({
      where: {
        vendorMenuId,
      },
    });
    cache.set(getFoodKeys("DISHES", vendorMenuId), dishes, 1500);

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "dished fetched successfully from db!",
      data: dishes,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while fetching dishes from db!",
    });
  }
};

export const creatMenuDishController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof vendorDishSchema> = req.body;
  const { menuId: vendorMenuId } = req.params;

  const { success, error, data } =
    await vendorDishSchema.safeParseAsync(reqBody);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let dishImageUrl: string | null = null;

  if (data.dishImage) {
    //upload to object store like s3, cloudinary or firebase
  }

  try {
    const dish = await prisma.vendorDish.create({
      data: {
        ...data,
        vendorMenuId,
        dishCategoryId: data.dishCategoryId ?? "",
        dishPrice: data.dishPrice.toString(),
        dishImage: dishImageUrl,
      },
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "dish created successfully!",
      data: dish,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while creating dish!",
    });
  }
};

export const createMenuCategoryController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof dishCategorySchema> = req.body;

  const { menuId: vendorMenuId } = req.params;

  const { success, error, data } =
    await dishCategorySchema.safeParseAsync(reqBody);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  try {
    const category = await prisma.dishCategory.findUnique({
      where: {
        categoryName: data.categoryName,
      },
    });

    if (category) {
      res.status(STATUS_CODES.FORBIDDEN).json({
        success: false,
        message: "Category already exists, try other name",
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      messsage: "Error while validating category name!",
    });
  }

  try {
    const category = await prisma.dishCategory.create({
      data: {
        ...data,
        vendorMenuId,
      },
    });

    res.status(STATUS_CODES.CREATED).json({
      success: true,
      message: "category created successfully!",
      data: category,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while creating dish category!",
    });
  }
};

export const updateMenuDishController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const reqBody: z.infer<typeof vendorDishSchema> = req.body;
  const { dishId } = req.params;

  const { success, error, data } = await vendorDishSchema
    .partial()
    .safeParseAsync(reqBody);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let dish: VendorDish | null = null;
  try {
    dish = await prisma.vendorDish.findUnique({
      where: {
        id: dishId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while verifying dish!",
    });
  }

  if (!dish) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "Dish not found, please verify dish id",
    });
    return;
  }

  const dishImageUrl: string | null | undefined = dish.dishImage;

  if (data.dishImage) {
    //process image and create url
  }

  try {
    const updatedDish = await prisma.vendorDish.update({
      where: {
        id: dishId,
      },
      data: {
        ...data,
        dishImage: dishImageUrl,
        dishPrice: data.dishPrice ? data.dishPrice.toString() : dish.dishPrice,
      },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: true,
      message: "Dish updated successfully!",
      data: updatedDish,
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error while updating dish!",
    });
  }
};

export const updateMenuCategoryController: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { categoryId } = req.params;
  const reqBody: z.infer<typeof dishCategorySchema> = req.body;

  const { success, data, error } =
    await dishCategorySchema.safeParseAsync(reqBody);

  if (!success) {
    res.status(STATUS_CODES.FORBIDDEN).json({
      success,
      message: error.issues.map((issue) => {
        return {
          path: issue.path[0],
          message: issue.message,
        };
      }),
    });
    return;
  }

  let category: DishCategory | null = null;

  try {
    category = await prisma.dishCategory.findUnique({
      where: {
        id: categoryId,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      sucesss: false,
      message: "Error while verifying category",
    });
    return;
  }

  if (!category) {
    res.status(STATUS_CODES.NOT_FOUND).json({
      success: false,
      message: "Category with this id not found, try again!",
    });
    return;
  }

  try {
    await prisma.dishCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        ...data,
      },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      success: false,
      message: "Data updated successfully!",
    });
  } catch (error) {
    console.error(error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      success: false,
      message: "Error occurred while updating the category data!",
    });
  }
};

//test remaining
