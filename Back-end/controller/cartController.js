const Product = require("../models/productSchema")
const Cart = require('../models/cartSchema');


const addtoCart = async(req,res)=>{
    const {productId,quantity}  = req.body
    const userId = req.user?.userId;
    try{
    let cart = await Cart.findOne({userId})
    const product  = await Product.findById(productId)
    if(!product){
        return res.status(404).json({message:"Product not found"})
    }
    const price = product.price
    if(!cart){
        cart = new Cart({
            items:[{productId,quantity,price}],
            cartby:userId     
        })
    }else{
        const itemExit= cart.items.find(item=>item.productId.toString() == productId)
        if(itemExit){
            return res.status(400).json({message:"item already exist"})
        }
        cart.items.push({productId,quantity,price})
    }
    await cart.save()
    res.status(200).json({message:"Item add Succefully"})
}catch(error){
    console.log(error)
    res.status(500).json({message:'Error in adding to cart'})
}
}


const getCart = async (req,res)=>{
    const userId = req.user?.userId

    try{
        const cart = await Cart.findOne({userId}).populate('items.productId')
        
        if(!cart){
            return res.status(404).json({message:"Cart is empty"})
        }
        res.status(200).json({items:cart.items})
    }catch(err){
        console.log('Cart error',err)
        res.status(500).json({message:"Server error"})
    }
}

const removeCart = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user?.userId;

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

       

        const originalLength = cart.items.length;

        
        cart.items = cart.items.filter(
            (item) => item.productId && item.productId.toString() !== productId
        );

        if (cart.items.length === originalLength) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        await cart.save();

        res.status(200).json({ message: "Item removed from cart" });
    } catch (err) {
        
        res.status(500).json({ message: "Server error" });
    }
};



module.exports = {getCart,removeCart,addtoCart}