const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController.js");

// 处理注册表单提交 (API 端点)
router.post("/register", authController.register);

// 处理登录表单提交 (API 端点)
router.post("/login", authController.login);

module.exports = router;
