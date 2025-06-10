const mongose = require('mongoose')
const env = require('dotenv').config()
const connectDB = async() => {
    
    try{  

        await mongose.connect((process.env.MONGODB_URI));
        console.log('DB Connect')
         
    }catch  (error){

        console.log("DB Connection error" , error.message);
        process.exit(1)

    }
}
module.exports=connectDB