import Product from "../models/product.model.js";
import {redis} from "../lib/redis.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllProducts= async(req,res)=>{
    try{
        const products= await Product.find({}); //find all products
        res.json({products});
    }
    catch(error){
        console.log("Error in getAllProducts Controller", error.message);
        res.status(500).json({message:"Server Error", error:error.message});
    }
};


export const getFeaturedProducts=async(req,res)=>{
    try{
        let featuredProducts= await redis.get("featured_products");
        if(featuredProducts){
            return res.json(JSON.parse(featuredProducts)); //Convert JSON string to JS object
        }

        //if not in redis, fetch from mongoDB, in form of JS object for better performance
        featuredProducts=await Product.find({isFeatured:true}).lean(); //Returns plain JS objects instead of mongodb docs

        if(!featuredProducts){
            return res.status(404).json({message:"No Featured Products found"}); 
        }
        //store in redis for future quick access
        await redis.set("featured_products", JSON.stringify(featuredProducts)); //Converts JS object to JSON String
        res.json(featuredProducts);
    }
    catch(error){
        console.log("Error in getFeaturedProducts controller",error.message);
        res.status(500).json({message:"Server error", error: error.message});
    }
};


export const createProduct=async(req,res)=>{
    try{
        const {name, description, price, image, category}= req.body;
        let cloudinaryResponse =null; //Declared outside due to scope issues

        if(image){
            cloudinaryResponse= await cloudinary.uploader.upload(image,{folder:"products"});
        }

        const product=Product.create({
            name,
            description,
            price,
            image: cloudinaryResponse?.secure_url ? cloudinaryResponse.secure_url : "",
            category
        });

        res.status(201).json(product);
    }
    catch(error){
        console.log("Error in createProduct controller ", error.message);
        res.status(500).json({message:"Server Error", error:error.message});
    }
}; 


export const deleteProduct=async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id );
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        //Deleting image from cloudinary
        if(product.image){
            const publicId=product.image.split("/").pop().split(".")[0]; //get publicid to delete from cloudinary 
        }
        try{
            await cloudinary.uploader.destroy(`products/${publicId}`);
            console.log("Deleted Image from cloudinary"); 
        }
        catch(error){
            console.log("Error deleting image from cloudinary");
        }
        //Deleting data from mongodb
        await Product.findByIdAndDelete(req.params.id); 
        res.json("Product Deleted Successfully");
    }
    catch(error){
        console.log("Error in deleteProduct controller ",error.message);
        res.status(500).json({message:"Server error",error:error.message});
    }  
};

//Get random 3 products as recommended
export const getRecommendedProducts=async(req,res)=>{
    try{
        const products =await Product.aggregate([
            {
                $sample: {size:4}
            },
            {
                $project:{
                    _id:1,
                    name:1,
                    description:1,
                    image:1,
                    price:1
                }
                
            }
        ]);
        res.json(products);
    }
    catch(error){
        console.log("Error in getRecommendedProducts Controller", error);
        res.status(500).json({message:"Server Error",error:error.message});
    }
};


export const getProductsByCategory = async (req, res) => {
	const { category } = req.params;
	try {
		const products = await Product.find({ category });
		res.json({ products });
	} catch (error) {
		console.log("Error in getProductsByCategory controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const toggleFeaturedProduct=async(req,res)=>{
    try{
        const prodId=req.params.id;
        const product=await Product.findById(prodId);
        if(product){
            product.isFeatured=!product.isFeatured;
            const updatedProduct=await product.save();
            //update cache
            await updateFeaturedProductsCache();
            res.json(updatedProduct);
        }else{
            res.status(404).json({message:"Product not found"});
        }
    }
    catch(error){
        console.log("Error in toggleFeaturedProducts Controller.", error);
        res.status(500).json({message:"Server error",error:error.message}); 
    }
};

async function updateFeaturedProductsCache(){
    try{
        const featuredProducts= await Product.find({isFeatured:true}).lean(); //to return JS objects
        await redis.set("featured_products",JSON.stringify(featuredProducts));
    } catch(error) {
        console.log("Error in updateFeaturedProductsCache function",error);
        // res.status(500).json({message:"Server Error",error:error.message});
    }
}