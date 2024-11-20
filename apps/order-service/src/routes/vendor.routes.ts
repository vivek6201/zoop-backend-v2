import { IRouter, Router } from "express";
import { getOrderDetailsController, getVendorOrderControllers } from "../controllers/vendor";

const router: IRouter = Router();

router.get("/:profileId/orders", getVendorOrderControllers);
router.get("/orders/:orderId", getOrderDetailsController);

export default router;
