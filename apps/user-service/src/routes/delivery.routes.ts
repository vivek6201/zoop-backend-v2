import { IRouter, Router } from "express";
import {
  createDeliveryProfileController,
  getDeliveryProfileController,
  updateDeliveryProfileController,
} from "../controllers";

const router: IRouter = Router();

router.post("/profile", createDeliveryProfileController);
router.get("/profile", getDeliveryProfileController);
router.patch("/profile/update", updateDeliveryProfileController);

export default router;
