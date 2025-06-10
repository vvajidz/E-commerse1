const mongoose = require("mongoose")

const wishlistSchema = new Schema({

    user:{
        type:String,
        ref:"users"
    },
    product:{
        type:String,
        ref:"product"
    },
    addedAt:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("wishlist",wishlistSchema )