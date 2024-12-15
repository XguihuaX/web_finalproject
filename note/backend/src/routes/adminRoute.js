const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const { verifyAdminToken } = require("../utils/jwt.js");

// 后端 API 路由部分

// 用户管理路由
router.get("/api/users", verifyAdminToken, adminController.getAllUsers);
router.get("/api/users/:userId", verifyAdminToken, adminController.getUserById);
router.delete("/api/users/:userId", verifyAdminToken, adminController.deleteUser);

// 笔记管理路由
router.get("/api/notes", verifyAdminToken, adminController.getAllNotes);
router.get("/api/notes/:noteId", verifyAdminToken, adminController.getNoteById);
router.delete("/api/notes/:noteId", verifyAdminToken, adminController.deleteNote);

// 图片管理路由
router.get("/api/images", verifyAdminToken, adminController.getAllImages);
router.get("/api/images/:imageId", verifyAdminToken, adminController.getImageById);
router.delete("/api/images/:imageId", verifyAdminToken, adminController.deleteImage);

module.exports = router;
