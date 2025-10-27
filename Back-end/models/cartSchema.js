const mongoose = require('mongoose')



const cartSchema = new mongoose.Schema({

cartBy: {
    type: mongoose.Schema.Types.ObjectId, // Must be ObjectId
    required: true,
    ref: "User"
  },
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },
    price: Number,
    quantity: {
      type: Number,
      default: 1,
      min: 1
    }
  }]
 
})


module.exports = mongoose.model("Cart" , cartSchema)