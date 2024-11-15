import { IRouter, Router } from "express";
import {
  createUserProfileController,
  getUserCartController,
  getUserController,
  getUserProfileController,
  updateUserCartController,
  updateUserProfileController,
} from "../controllers";

const router: IRouter = Router();

router.post("/profile/create", createUserProfileController);
router.get("/", getUserController);
router.get("/profile", getUserProfileController);
router.patch("/profile/update", updateUserProfileController);

//cart routes
router.get("/cart", getUserCartController);
router.patch("/cart", updateUserCartController);


export default router;
