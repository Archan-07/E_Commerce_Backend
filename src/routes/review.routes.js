import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addOrUpdateReview,
  deleteReview,
  getProductReview,
} from "../controllers/review.controller.js";

const router = Router();
router.use(verifyJWT);

router.route("/addOrUpdateReview/:productId").post(addOrUpdateReview);
router.route("/getProductReview/:productId").get(getProductReview);
router.route("/deleteReview/:reviewId").delete(deleteReview);
export default router;
