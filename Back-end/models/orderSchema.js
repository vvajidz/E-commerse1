const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
       orderBy:{
        type:String
       },
    orders:[
        {
            productId:{
                type:String,
            },
            quantity:{
                type:Number,
            },
            price:{
                type:Number
            }
        }
       ] ,
       total:{
        type:Number
       } ,
       status:{
        type:String,
        enum:["confirmed","pending","shipped","delivered"],
        default:"pending"
       },
       paymentMethod:{
        type:String,
        enum:["cod","Raorpay"]
       },
       createdAt:{
        type:String,
       }

})

module.exports = mongoose.model("Order" , orderSchema)