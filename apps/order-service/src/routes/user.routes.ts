import { IRouter, Router } from "express";
import {
  getOrderDetailsController,
  getUserOrdersControllers,
} from "../controllers/user";

const router: IRouter = Router();

router.get("/:profileId/orders", getUserOrdersControllers);
router.get("/orders/:orderId", getOrderDetailsController);

export default router;
