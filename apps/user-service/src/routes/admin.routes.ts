import { IRouter, Router } from "express";
import {
  createAdminProfileController,
  getAdminProfileController,
  updateAdminProfileController,
} from "../controllers";

const router: IRouter = Router();

router.post("/profile", createAdminProfileController);
router.get("/profile", getAdminProfileController);
router.patch("/profile/update", updateAdminProfileController);

export default router;
