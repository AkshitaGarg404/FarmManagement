import User from "../models/user.model.js";
import Product from "../models/product.model.js";

export const addToCart= async(req,res)=>{
    try{
        //instead of getting product id from params, we get it from body
        const {productId} =req.body;
        const user = req.user;
        const existingItem=user.cartItems.find((item) => item.id===productId);
        if(existingItem){
            existingItem.quantity+=1;
        } else {
            user.cartItems.push(productId);
        }
    
        await user.save();
        res.json(user.cartItems);
    } catch(error) {
        console.log("Error in addToCart controller",error);
        res.status(500).json({message:"Server Error", error:error.message});
    }
}


export const removeAllFromCart=async(req,res)=>{
    try {
        const {productId} = req.body;
        const user= req.user;
        if(!productId){ //if there is no productId then clear the entire cart
            user.cartItems=[];
        } else {
            user.cartItems = user.cartItems.filter((item)=> item.id!==productId);
        }
        await user.save();
        res.json(user.cartItems);
    } catch (error) {
        console.log("Error in removeAllFromCart controller",error);
        res.status(500).json({message:"Server Error", error:error.message});
    }
}


export const updateQuantity=async(req,res)=>{
    try {
        const {id:productId} = req.params; //we passed it as paramter in cart.route.js 
        const {quantity} =req.body; //Instead of reading whether number of items is  incremented or decremented, we read the final quantity
        const user=req.user;
        const existingItem= user.cartItems.find((item)=>item.id===productId);

        if(existingItem){
            if(quantity===0){
                user.cartItems=user.cartItems.filter((item)=>itemid!==productId);
                await user.save();
                res.json(user.cartItems);
            } else {
                existingItem.quantity=quantity;
                await user.save();
                res.json(user.cartItems);
            }
        }
        else{
            res.status(404).json({message:"Product not found in cart"});
        }
    } catch (error) {
        console.log("Error in updateQuantity controller",error);
        res.status(500).json({message:"Server Error", error:error.message});
    }
}


export const getCartProducts = async (req, res) => {
	try {
		const products = await Product.find({ _id: { $in: req.user.cartItems } });

		// add quantity for each product
		const cartItems = products.map((product) => {
			const item = req.user.cartItems.find((cartItem) => cartItem.id === product.id);
			return { ...product.toJSON(), quantity: item.quantity };
		});

		res.json(cartItems);
	} catch (error) {
		console.log("Error in getCartProducts controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};