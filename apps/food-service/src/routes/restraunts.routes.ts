import { IRouter, Router } from "express";
import {
  getAllRestrauntsController,
  getRestrauntDetailsController,
  getRestrauntMenuController,
} from "../controllers/restraunts";

const router: IRouter = Router();

router.get("/", getAllRestrauntsController);
router.get("/:id/details", getRestrauntDetailsController);
router.get("/:id/menu", getRestrauntMenuController);

export default router;
