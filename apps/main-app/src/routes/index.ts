import { Router } from "express";
import authRoutes from "./auth.routes";
import { createProxyMiddleware } from "http-proxy-middleware";

const router: Router = Router();

router.use("/auth", authRoutes);
router.use("/user");
router.use("/vendor");
router.use("/delivery");

export default router;
