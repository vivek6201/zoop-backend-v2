import { IRouter, Router } from "express";
import {
  checkoutUserController,
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
router.post("/checkout", checkoutUserController);


export default router;
