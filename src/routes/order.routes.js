import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";
import {
  getAllOrders,
  getUserOrders,
  placeOrder,
  updateOrderStatus,
} from "../controllers/order.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/placeOrder").post(placeOrder);
router.route("/getOrders").get(getUserOrders);
router.route("/getAllOrders").get(isAdmin, getAllOrders);
router.route("/updateOrderStatus/:orderId").put(isAdmin, updateOrderStatus);

export default router;
