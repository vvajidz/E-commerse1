const User = require('../models/userSchema')
const jwt = require('jsonwebtoken');
const env = require('dotenv').config()
const bcrypt = require('bcrypt')


const JWT_SECRET= process.env.USER_SECRET_KEY

const SignUp = async(req,res)=>{
    const{name,email,password}=req.body
    try{
        if(!email||!password){
            return res.status(404).json({message:
                'Email and Password are required'
            })
        }
        const existingUser = await 
        User.findOne({email})
        if(existingUser){
            return res.status(404).json({message:"User already exist"})
        }
        const saltRounds = 10;
        const hashedpass = await
        bcrypt.hash(password,saltRounds)


        const newUser = new User({name,email,password:hashedpass})
        await newUser.save()

        const token = jwt.sign({userId:newUser._id,email:newUser.email},
            JWT_SECRET,{expiresIn:'1h'})
        
            res.cookie('token',token,{
                httpOnly:true,
                secure:false,
                sameSite:'strict',
                maxAge:60*60*1000
            })
        res.status(200).json({message:'User created Successfully',
            user:{
                id:newUser._id,
                email:newUser.email
            },token
        })
          
        }catch(err){
            console.error('Error for save User',err);
            res.status(500).send('internal server error')
        }
}

const LogIn  =async (req,res)=>{
    const {email,password}=req.body

    try{
    if(!email||!password){
        return res.status(400).json({message:'Email and Password are required'})
    }
    const user = await User.findOne({email})
    const match =  bcrypt.compare(password,user.password)
    if(!match){
        return res.status(404).json({message:'Password not match'})
    }

    const token = jwt.sign({userID:user._id,email:user.email},JWT_SECRET,{expiresIn:'1hr'})

    res.cookie('token',token,{
        httpOnly:true,
        secure:false,
        sameSite:'strict',
        maxAge:60*60*1000
    })
    res.status(200).json({message:'Login Successful',
        user:{
            id:user._id,
            email:user.email
        },token
    })
}catch(err){
 console.error('error on login',err)
 res.status(500).send('Internal server error')
   }
}

module.exports ={SignUp,LogIn}