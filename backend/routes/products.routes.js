import { Router } from "express";
import {
  createProducts,
  updateProducts,
  updateProductImg,
  deleteProduct,
  getAllProducts,
  getProductsByCategory,
  getFeaturedProducts,
  toggleFeaturedProducts,
  addReviews
} from "../controllers/products.controller.js";
import { authentication, sellerRoute } from "../middlewares/auth.middleawre.js";

const router = Router();

router.get("/", authentication, sellerRoute, getAllProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/featured", getFeaturedProducts);

router.post("/", authentication, sellerRoute, createProducts);
router.post("/reviews/:id", authentication, addReviews);

router.patch("/:id", authentication, sellerRoute, updateProducts);
router.patch("/:id", authentication, sellerRoute, toggleFeaturedProducts);
router.put("/:id", authentication, sellerRoute, updateProductImg);

router.delete("/:id", authentication, sellerRoute, deleteProduct);

export default router;
