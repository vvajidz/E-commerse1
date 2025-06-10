const mongoose = require('mongoose')
const {Schema} =mongoose

const userSchema = new Schema({
    name:{
        type:String,
         require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },

    isBlocked:{
        type:Boolean,
        default:false
    },
    isActive:{
        type:Boolean,
        default:false
    },
    CreateOn:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model("User", userSchema)

