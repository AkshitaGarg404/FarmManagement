import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router= express.Router();
//This is protected and only admin can access the analytics
router.get("/",protectRoute,adminRoute, async(req,res)=>{
    try {
        //This is for blocks
        const analyticsData= await getAnalyticsData();

        //For the graph.. we need data over a period of 7 days - today se uske pehle 7 din tk
        const endDate=new Date(); //today
        const startDate=new Date(endDate.getTime()-7*24*60*60*1000); //7 days earlier

        const dailySalesData= await getDailySalesData(startDate,endDate);
        res.json({
            analyticsData,
            dailySalesData
        });
    } catch (error) {
        console.log("Error in Analytics Route ",error.message);
        res.status(500).json({message:"Server error", error:error.message});
    }
});

export default router;