import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controllers.js";
import { validate } from "../middleware/validationMiddleware.js";
import {createProductSchema,updateProductSchema,} from "../validation/product.validation.js";
// Dev6 - Multer Image Upload
import {uploadMultipleImage} from "../middleware/upload.js"
import { authentication, restrictTo } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authentication,restrictTo("admin"),uploadMultipleImage,validate(createProductSchema), createProduct);

router.put(
  "/update/:id",
  authentication,
  restrictTo("admin"),
  validate(updateProductSchema),
  updateProduct
);
router.delete(
  "/:id",
  authentication,
  restrictTo("admin"),
  deleteProduct
);
export default router;