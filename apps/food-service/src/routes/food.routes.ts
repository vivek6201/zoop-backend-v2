import { IRouter, Router } from "express";
import {
  createMenuCategoryController,
  creatMenuDishController,
  getAllCategoriesController,
  getAllDishesController,
  updateMenuCategoryController,
  updateMenuDishController,
} from "../controllers/restraunts";
import { isValidRole } from "../middlewares/auth";
import { Role } from "@repo/db/src";

const router: IRouter = Router();

router.get("/:menuId/categories", getAllCategoriesController);
router.get("/:menuId/dishes", getAllDishesController);

router.post(
  "/:menuId/dish/create",
  isValidRole([Role.Vendor]),
  creatMenuDishController
);
router.post(
  "/:menuId/categories/create",
  isValidRole([Role.Vendor]),
  createMenuCategoryController
);

router.patch(
  "/:dishId/dish/update",
  isValidRole([Role.Vendor]),
  updateMenuDishController
);
router.patch(
  "/:categoryId/categories/update",
  isValidRole([Role.Vendor]),
  updateMenuCategoryController
);

export default router;
