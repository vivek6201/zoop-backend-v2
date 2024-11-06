import { IRouter, Router } from "express";
import userRoutes from "./user.routes";
import vendorRoutes from "./vendor.router";
import deliveryRoutes from "./delivery.routes";
import adminRoutes from "./admin.routes";

const router: IRouter = Router();

router.use("/vendor", vendorRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/delivery", deliveryRoutes);

export default router;
