const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController.js");

// 显示注册页面
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// 显示登录页面
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// 处理注册表单提交 (API 端点)
router.post("/register", authController.register);

// 处理登录表单提交 (API 端点)
router.post("/login", authController.login);


module.exports = router;
