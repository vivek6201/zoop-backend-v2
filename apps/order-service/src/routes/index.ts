import { IRouter, Router } from "express";
import vendorRoutes from "./vendor.routes"
import userRoutes from "./user.routes";

const router: IRouter = Router();

router.use("/vender", vendorRoutes);
router.use("/user", userRoutes);

export default router;
