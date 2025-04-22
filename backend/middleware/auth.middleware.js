import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute= async (req,res,next)=>{
    try{
        const accessToken =req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({message: "Unauthorized Access: No access token provided"});
        }
        //if accesstoken found then decode it to get userid
        try{
            //get user info from access token
            const decoded=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.userId).select("-password");
            if(!user){
                return res.status(401).json({message: "User not found"});
            }
            //set req.user as user to access it later
            req.user=user;
            next(); 
        }
        catch(error){
            if(error.name=== "TokenExpiredError"){
                return res.status(401).json({message:"Unauthorized: Access Token Expired"});
            }else{
                throw error;
            }
            
        } 
    }
    catch(error){
        console.log("Error in protectroute middleware",error.message);
        res.status(401).json({message:"Unauthorized: Invalid Access Token"});
    }
};


export const adminRoute=async(req,res,next)=>{
    if(req.user && req.user.role==="admin"){
        next();
    }else{
        return res.status(403).json({message:"Access Denied - Admin Only"}); 
    }
};