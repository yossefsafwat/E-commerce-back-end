import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  replaceProductImage
} from "../controllers/productController.js";
import { validate } from "../middleware/validationMiddleware.js";
import {createProductSchema,updateProductSchema,} from "../validation/productValidation.js";
// Dev6 - Multer Image Upload
import {uploadMultipleImage,uploadSingleImage} from "../middleware/upload.js"
import { authentication, restrictTo } from "../middleware/auth.middleware.js"

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", authentication,restrictTo("admin"),uploadMultipleImage,validate(createProductSchema), createProduct);
router.delete("/:productId/images/:imageId",authentication,restrictTo("admin"),deleteProductImage)
router.put("/update/:id", validate(updateProductSchema), updateProduct);
router.put("/:productId/images/:imageId",authentication,restrictTo("admin"),uploadSingleImage,replaceProductImage)
router.delete("/:id", deleteProduct);
export default router;