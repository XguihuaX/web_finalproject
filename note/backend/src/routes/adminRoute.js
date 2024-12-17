const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController.js");
const { verifyAdminToken } = require("../utils/jwt.js");

// 后端 API 路由部分

// 用户管理路由
router.get("/users", verifyAdminToken, adminController.getAllUsers);
router.get("/users/:userId", verifyAdminToken, adminController.getUserById);
router.delete("/users/:userId", verifyAdminToken, adminController.deleteUser);

// 笔记管理路由
router.get("/notes", verifyAdminToken, adminController.getAllNotes);
router.get("/notes/:noteId", verifyAdminToken, adminController.getNoteById);
router.delete("/notes/:noteId", verifyAdminToken, adminController.deleteNote);

// 图片管理路由
router.get("/images", verifyAdminToken, adminController.getAllImages);
router.get("/images/:imageId", verifyAdminToken, adminController.getImageById);
router.delete("/images/:imageId", verifyAdminToken, adminController.deleteImage);

module.exports = router;
