import { IRouter, Router } from "express";
import {
  createVendorProfileController,
  getVendorController,
  getVendorProfileController,
  updateVendorProfileController,
} from "../controllers";

const router: IRouter = Router();

router.post("/profile/create", createVendorProfileController);
router.get("/", getVendorController);
router.get("/profile", getVendorProfileController);
router.patch("/profile/update", updateVendorProfileController);

export default router;
