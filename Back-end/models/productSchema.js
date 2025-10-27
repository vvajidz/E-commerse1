const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({

    name:{
        type:String,
        require:true
    },
    brand:{
        type:String,
        require:true
    },
    description:{
        type:String,
        require:true
    },
    price:{
        type:Number,
        require:true
    
    },
    category:{
        type:String,
        require:true
    },
    image:{
        type:[String]
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

module.exports = mongoose.model("Product" , productSchema)