const Products = require('../models/productSchema')

const getAllProducts = async (req , res ) => {
    try{
   const product  = await Products.find()
   return res.status(200).json({product})
}catch{
    res.status(500).json({message:"server errrp"})
}
}



const getProductById = async (req , res) => {
    const {id} = req.params
try{
    const product = await Products.findById(id)
    if(!product){
        return res.status(404).json({messages:"Product not found"})
    }
    res.status(200).json({product})
}catch{
       console.error('error on fetching product by id')
       res.status(500).json({messages:"Server error"})
    }
}


const getProductByCategory = async (req , res) => {
    const categoryName = req.params.categoryName

    try{
        const products = await Products.find({category : categoryName})
    if (!products || products.length === 0){
        return res.status(404).json({message:"No Product Found in this Category"})
    }
    res.json(products)
    }catch (error){
        res.status(500).json({message:"Server Error"})
    } 
} 







module.exports = {getAllProducts, getProductById,getProductByCategory}