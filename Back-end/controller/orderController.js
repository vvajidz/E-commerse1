const orderModel = require('../models/orderSchema')
const productModel = require('../models/productSchema')
const cartModel = require('../models/cartSchema')
  
const AddOrder = async(req,res)=>{
       try {
        const { items,paymentMethod } = req.body
        const userId = req.user?.id
        let total = 0
        
        for (const item of items) {
            const product = await productModel.findById(item.productId)
            if (!product) {
                return res.status(404).json({message:"Product not found"})
            }
            if (product.stock < item.quantity) {
                return (400).json({ message: "out of stock" })
            }
            total += product.price * item.quantity
           
        }
        const newOrder = {
            items,
            paymentMethod,
            total
        }

        let userOrder = await orderModel.findOne({userId:userId})
        if(userOrder){
            userOrder.orders.push(newOrder)
            await userOrder.save()
        }
        else{
         const order = new orderModel({
           userId:userId,
           orders:[newOrder]
        })

        await order.save()
        }
            for (const item of items) {
            await productModel.findByIdAndUpdate(
                item.productId,
                { $inc: { stock: -item.quantity } }
            );

        }
        await cartModel.deleteMany({ User: userId })
        res.status(201).json({ message: "order is placed" })
    }
    catch (error) {
        res.status(500).json("server error" + error)
}

}

const getOrder = async(req,res)=>{
    const user =req.user?.id

    try{
        const oderItem = await orderModel.find({userId:user}).populate("orderBy")
        if(!oderItem)
{
     return res.status(404).json({message:"No order Found"})
}  
res.status(200).json({order:oderItem})
  }
  catch(error){
    res.status(500).json({message:"Failed to get"})
  }

}

module.exports = {AddOrder,getOrder}