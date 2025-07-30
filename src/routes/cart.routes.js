import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  clearCart,
  getCart,
  removerFromCart,
} from "../controllers/cart.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/addToCart").post(addToCart);
router.route("/getCart").get(getCart);
router.route("/removeFromCart/:productId").delete(removerFromCart);
router.route("/clear").delete(clearCart);
export default router;
