import { IRouter, Router } from "express";
import { getUserOrdersControllers } from "../controllers/user";

const router: IRouter = Router();

router.get("/orders", getUserOrdersControllers);

export default router;
