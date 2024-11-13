import { IRouter, Router } from "express";
import userRoutes from "./user.routes";
import vendorRoutes from "./vendor.router";
import deliveryRoutes from "./delivery.routes";
import adminRoutes from "./admin.routes";
import { isValidRole } from "../middleware/auth";
import { Role } from "@repo/db/src";

const router: IRouter = Router();

const routeLogger = (req: any, _res: any, next: any) => {
  console.log("Route hit:", {
    method: req.method,
    path: req.path,
    body: req.body,
  });
  next();
};

router.use(routeLogger);

router.use("/vendor", isValidRole([Role.Vendor]), vendorRoutes);
router.use("/user", isValidRole([Role.User]), userRoutes);
router.use("/admin", isValidRole([Role.Admin]), adminRoutes);
router.use("/delivery", isValidRole([Role.DeliveryPartner]), deliveryRoutes);

export default router;
