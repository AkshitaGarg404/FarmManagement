import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

//Function to generate access and refresh tokens by jwt
const generateTokens=(userId)=> {
    const accessToken= jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
    });
    const refreshToken=jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    return {accessToken, refreshToken};
};

//function to store refresh token in redis database
const storeRefreshToken=async function(userId, refreshToken){
    await redis.set(`refresh_token:${userId}`,refreshToken,"EX",7*24*60*60); //7 days
};

//setting cookies
const setCookies= async function(res, accessToken, refreshToken){
    res.cookie("accessToken", accessToken, {
        maxAge: 15*60*1000, //expires in 15 minutes
        httpOnly: true, //prevent XSS attacks - cross site scripting attacks
        secure: process.env.NODE_ENV==="production", //this is true only in production mode -prevent man in the middle attacks
        sameSite: "strict"  //prevents CSRF Attacks - cross site request forgery
    });
    res.cookie("refreshToken", refreshToken, {
        maxAge: 7*24*60*60*1000, //expires in 7 days
        httpOnly: true, //prevent XSS attacks - cross site scripting attacks
        secure: process.env.NODE_ENV==="production", //this is true only in production mode -prevent man in the middle attacks
        sameSite: "strict"  //prevents CSRF Attacks - cross site request forgery
    });
};

//signup function which is called when api/auth/signup route is active
export const signup=async (req,res)=> {
    try{
        //First take user details and if he is already in db then throw error and abort otherwise add
        const {name,email,password}=req.body;
        const userExists=await User.findOne({email});
        if(userExists){
            return res.status(400).json({message: "User already exists", });
        }
        const user=await User.create({name,email,password});

        //Authenticate, so first generate and store access and refresh tokens
        const {accessToken, refreshToken}=generateTokens(user._id);
        storeRefreshToken(user._id, refreshToken);
        //Handle cookies
        setCookies(res, accessToken, refreshToken);

        //set response status and mssg for successful signup
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email:user.email,
            role:user.role,
        });
    }
    catch(error){
        console.log("Error in signup controller",error.message);
        res.status(500).json({message: error.message});
    }
};



//login function which is called when api/auth/login route is active
//Here compare password and then same as signup, generate access and refresh tokens and store refreshtoken in redis db
export const login=async (req,res)=> {
    try{
        const {email,password}= req.body;
        const user = await User.findOne({email});
        //if user exists and password is same: login successful.
        if(user && (await user.comparePassword(password))){
            const {accessToken, refreshToken}= generateTokens(user._id ); //generate
            await storeRefreshToken(user._id, refreshToken); //store refresh in redis //we put await here bcoz we are accessing external database so this process should be asynchronous
            setCookies(res, accessToken, refreshToken); //set cookies //No need of await because there is no external fetching or writing

            res.status(200).json({ //output mssg response
                _id: user._id,
                name: user.name,
                email:user.email,
                role:user.role,
            });
        }
        else{
            res.status(400).json({message:"Invalid Email or password"});
        }
    }
    catch(error){
        console.log("Error in login controller",error.message);
        res.status(500).json({message:"Server Error", error:error.message});
    }
};





//logout function which is called when api/auth/logout route is active
//we need to delete access and refresh cookies and delete refresh cookie from redis
export const logout=async (req,res)=> {
    try{
        //To be able to read these cookies include cookie-parser as middleware, in server.js: app.use(cookie-parser)
        const refreshToken= req.cookies.refreshToken; 
        if(refreshToken){
            const decoded= jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            await redis.del(`refresh_token:${decoded.userId}`);
        }
        
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.json({message: "Logged Out Successfully"}); 
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        return res.status(500).json({ message: "Server Error", error: error.message});
    }
};


//Write a function to refresh the access token if user is still using the page and the access Token dies
export const refreshToken=async(req,res) =>{
    try{
        const refreshToken=req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({message: "Refresh Token not provided"});
        }

        const decoded=jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken= await redis.get(`refresh_token:${decoded.userId}`);

        if(storedToken!==refreshToken){
            return res.status(401).json({message:"Refresh Token Invalid"});
        }

        const accessToken=jwt.sign({userId: decoded.userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"15m"});
        res.cookie("accessToken",accessToken, {
            maxAge: 15*60*1000,
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:"strict",
        });
        res.json({message:"Access Token refreshed successfully"});
    }
    catch(error){
        console.log("Error in refresh token controller", error.message);
        res.status(500).json({message:"Server Error", error:error.message});
    }
};

export const getProfile=async(req,res)=>{
    try {
        res.json(req.user);
    } catch (error) {
        console.log("Error in getProfile Controller");
        res.status(500).json({message:"Server Error",error:error.message});
    }
}
