const express = require('express');
const router = express.Router();
const authController = require('../controller/authController');
const adminLog = require("../middleware/adminlog")

// 👤 User routes
router.post('/user/signup', authController.signup);
router.post('/user/login', authController.login);
router.post('/user/logout', authController.logout);

router.post('/admin/login',adminLog, authController.login);
router.post('/admin/logout', authController.logout);

module.exports = router;
