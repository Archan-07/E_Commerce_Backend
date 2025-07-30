import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT);
router
  .route("/createProduct")
  .post(isAdmin, upload.single("image"), createProduct);
router.route("/getProductById/:productId").get(getProductById);
router.route("/updateProduct/:productId").put(isAdmin, updateProduct);
router.route("/deleteProduct/:productId").delete(isAdmin, deleteProduct);
router.route("/getAllProducts").get(getAllProducts);

export default router;
