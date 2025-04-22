import express from "express";
import {addToCart, getCartProducts, removeAllFromCart, updateQuantity} from "../controllers/cart.controller.js";
import {protectRoute} from "../middleware/auth.middleware.js";

const router=express.Router();

//Since all of these are protectRoutes that means when we reach the last function, we have user as req.user.. so access it directly
router.get("/",protectRoute, getCartProducts);
router.post("/",protectRoute, addToCart);
router.delete("/",protectRoute, removeAllFromCart);
router.put("/:id",protectRoute, updateQuantity);

export default router;