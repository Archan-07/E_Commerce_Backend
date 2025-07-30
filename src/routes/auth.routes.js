import { Router } from "express";
import {
  loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/loginLimitter.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginLimiter, loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshToken").post(refreshAccessToken);

export default router;
