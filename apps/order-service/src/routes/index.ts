import { IRouter, Router } from "express";
import vendorRoutes from "./vendor.routes";
import userRoutes from "./user.routes";
import { isValidRole } from "../middleware/auth";
import { Role } from "@repo/db/src";

const router: IRouter = Router();

router.use("/vendor", isValidRole([Role.Vendor]), vendorRoutes);
router.use("/user", isValidRole([Role.User]), userRoutes);

export default router;
