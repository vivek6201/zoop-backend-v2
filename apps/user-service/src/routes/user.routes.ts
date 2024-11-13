import { IRouter, Router } from "express";
import {
  createUserProfileController,
  getUserController,
  getUserProfileController,
  updateUserProfileController,
} from "../controllers";

const router: IRouter = Router();

router.post("/profile/create", createUserProfileController);
router.get("/", getUserController);
router.get("/profile", getUserProfileController);
router.patch("/profile/update", updateUserProfileController);

export default router;
