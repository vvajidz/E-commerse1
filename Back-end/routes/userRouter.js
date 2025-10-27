
const express = require('express');
const router = express.Router();

// Auth middleware
const userAuth = require('../middleware/userAuth');

//  Controllers
const productController = require('../controller/productController');
const cartController = require('../controller/cartController');
const orderController = require('../controller/orderController');

//  Public product routes
router.get('/product', productController.getAllProducts);
router.get('/product/:id', productController.getProductById);
router.get('/category/:categoryName', productController.getProductByCategory);

//  Cart routes (User auth required)
router.post('/cart/addItem', userAuth, cartController.addToCart);
router.get('/cart', userAuth, cartController.getCart);
router.delete('/cart/remove/:id', userAuth, cartController.removeCart);
router.post("/cart/MandP",userAuth,cartController.addANDminusCart)

//  Order routes (User auth required)
router.get('/order', userAuth, orderController.getOrder);
router.post('/order/buynow', userAuth, orderController.AddOrder);

module.exports = router;



