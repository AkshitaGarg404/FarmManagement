import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js"; //Extension .js is necessary for importing a local file in type:module
dotenv.config();
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

const app =express(); //main variable of express
app.use(express.json({limit:"10mb"})); //Parse incoming body of the request should be before port 

const PORT = process.env.PORT || 5000; //If you can't read PORT from .env using dotenv package then use 5000 as port number
//Include cookie parser to read cookies from req during logout session
//This should be above authRoutes because baad mein hoga toh jb api/auth/logout call hua toh usko pta hi nhi tha cookie-parser ke baare mein
app.use(cookieParser());

app.use("/api/auth", authRoutes) //Tells express to use the authRoutes for any request that starts with /api/auth
app.use("/api/products", productRoutes) //Tells express to use the productRoutes for any request that starts with /api/products
app.use("/api/cart", cartRoutes) //Tells express to use the cartRoutes for any request that starts with /api/cart
app.use("/api/coupons", couponRoutes) //Tells express to use the couponRoutes for any request that starts with /api/coupon
app.use("/api/payments",paymentRoutes) //Tells express to use the paymentRoutes for any request that starts with /api/payments
app.use("/api/analytics", analyticsRoutes) //Tells express to use the analyticsRoutes for any request that starts with /api/analytics


app.listen(PORT,() =>{ //Start the server
    console.log("Server is running on http://localhost:"+PORT);
    connectDB();
});
