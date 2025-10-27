// const express =  require('express')
// const router = express.Router()
// const adminAuth = require('../middleware/adminAuth')
// const multerAuth = require('../middleware/multerAuth')

// const adminController = require('../controller/ADMIN/adminController')
// const adminProducts = require('../controller/ADMIN/adminProducts')
// const adminUsers = require('../controller/ADMIN/adminUsers')
// const adminOrders = require('../controller/ADMIN/adminOrders')
// const upload = require('../middleware/multerAuth')
// const { LogOut } = require('../controller/userController')
// router.post('/login',adminController.adminlogin)
// router.post('/logout',adminController.LogOut)
// router.get('/product',adminAuth,adminProducts.getAllproducts)
// router.get('/product/:id',adminAuth,adminProducts.getProductById)
// router.get('/category/:categoryName',adminAuth,adminProducts.getProductByCategory)
// router.get('/user',adminAuth,adminUsers.getAllUsers)
// router.get('/user/:id',adminAuth,adminUsers.getUserbyId)
// router.get('/order',adminAuth,adminOrders.getAllOrders )
// router.put('/user/block-switch/:id',adminAuth,adminUsers.blockAndUnblock)
// router.post('/add-product',adminAuth,multerAuth.array('images' , 5),adminProducts.addProduct)
// router.put('/product/:id',adminAuth,upload.array('images' , 5),adminProducts.updateProduct)
// router.patch('/product/del-actv/:id',adminProducts.deactivateProduct)




// module.exports = router

const express = require('express');
const router = express.Router();

// 🛡️ Middleware
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/multerAuth');

// 📦 Controllers
const adminProducts = require('../controller/ADMIN/adminProducts');
const adminUsers = require('../controller/ADMIN/adminUsers');
const adminOrders = require('../controller/ADMIN/adminOrders');

// ✅ Admin-only Product routes
router.get('/product', adminAuth, adminProducts.getAllproducts);
router.get('/product/:id', adminAuth, adminProducts.getProductById);
router.get('/category/:categoryName', adminAuth, adminProducts.getProductByCategory);
router.post('/add-product', adminAuth,upload.array('files'), adminProducts.addProduct);
router.put('/product/:id', adminAuth,upload.array('files'), adminProducts.updateProduct);
router.patch('/product/del-actv/:id', adminAuth, adminProducts.deactivateProduct);

// 👤 Admin-only User routes
router.get('/user', adminAuth, adminUsers.getAllUsers);
router.get('/user/:id', adminAuth, adminUsers.getUserbyId);
router.put('/user/block-switch/:id', adminAuth, adminUsers.blockAndUnblock);

// 📦 Admin-only Order routes
router.get('/order', adminAuth, adminOrders.getAllOrders);

module.exports = router;
