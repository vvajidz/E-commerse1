const express =  require('express')
const router = express.Router()
const userController = require("../controller/userController")
const productController = require("../controller/productController")
const cartController = require("../controller/cartController")
const orderController = require('../controller/orderController')
const userAuth = require("../middleware/userAuth")

router.post('/SignUp',userController.SignUp)
router.post('/LogIn',userAuth,userController.LogIn)
router.get('/getproduct',productController.getAllProducts)
router.get('/getproduct/:id',productController.getProductById)
router.get('/getproduct/category/:categoryName',productController.getProductByCategory)
router.post('/cart/addItem',cartController.addtoCart)
router.get('/cart',cartController.getCart)
router.delete('/cart/remove/:id',cartController.removeCart)
router.get('/order',orderController.getOrder)
router.post('/order/buynow',orderController.AddOrder)


module.exports = router 



