import {
  changeCurrentPassword,
  getCurrentUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router()
router.route("/changePassword").post(verifyJWT, changeCurrentPassword);
router.route("/getCurrentUser").get(verifyJWT, getCurrentUser);
router.route("/updateProfile").put(verifyJWT, updateUserProfile);


export default router; 