const Order = require('../../models/orderSchema')

const getAllOrders = async(req , res) => {
  try{
    const orders = await Order.find().sort({ createdAt: -1})

    if(!orders || orders.length === 0 ){
      return res.statud(404).json({message:"No Orders found"})
    }
    res.status(200).json(orders)
  }catch(err){
      console.error("Admin fetching orders : " , err)
      res.status(500).json({message : "Server error while fetching orders"})
    }
  }

module.exports = {getAllOrders}