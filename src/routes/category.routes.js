import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
} from "../controllers/category.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const router = Router();
router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router.route("/createCategory").post(isAdmin,createCategory);
router.route("/getAllCategories").get(getAllCategories);
router.route("/updateCategory/:categoryId").put(isAdmin,updateCategory);
router.route("/deleteCategory/:categoryId").delete(isAdmin,deleteCategory);
export default router;
