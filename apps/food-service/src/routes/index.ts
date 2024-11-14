import { IRouter, Router } from "express";
import restrauntRoutes from "./restraunts.routes";
import foodRoutes from "./food.routes"

const router: IRouter = Router();

router.use("/restraunts", restrauntRoutes);
router.use("/food", foodRoutes)

export default router;