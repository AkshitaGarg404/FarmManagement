import express from "express";
import { 
    getAllProducts, 
    getFeaturedProducts, 
    createProduct, 
    deleteProduct,
    getRecommendedProducts,
    getProductsByCategory,
    toggleFeaturedProduct
} from "../controllers/product.controller.js"
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
const router=express.Router();

//Here, protectroute means user should have an access token
//router.get("/",getAllProducts);
//But this means that everyone can get all the products and we don't want want
//Only admin should be able to access this info so we need to enter some credentials that only admin has
router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category",getProductsByCategory);
router.get("/recommendations",getRecommendedProducts);
router.post("/",protectRoute, adminRoute, createProduct);
router.patch("/:id",protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id",protectRoute, adminRoute, deleteProduct);


export default router;