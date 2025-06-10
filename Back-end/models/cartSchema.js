const mongoose = require('mongoose')



const cartSchema = new mongoose.Schema({

 userId:{
        type:String,
        require:true,
        ref:"User"
  },
  items:[{
    productId:{
        type:String,
        require:true,
        ref:"Product"
    },
    price:{
        type:Number,
        require:true,
    },
    quantity:{
        type:Number,
        require:true,
    },
    totalprice:{
        type:Number
    },
  }]
 
})


module.exports = mongoose.model("Cart" , cartSchema)