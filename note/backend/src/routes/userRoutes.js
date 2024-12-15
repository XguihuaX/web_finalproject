const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController.js");
const noteController = require("../controllers/noteController.js");
const { verifyUserToken } = require("../utils/jwt.js");

// 图片相关路由 (API)
router.post("/images", verifyUserToken, imageController.addImage);
router.get("/images", verifyUserToken, imageController.getImages);
router.get("/images/:imageId", verifyUserToken, imageController.getImage);
router.delete("/images/:imageId", verifyUserToken, imageController.deleteImage);

// 笔记相关路由 (API)
router.post("/notes", verifyUserToken, noteController.addNote);
router.get("/notes", verifyUserToken, noteController.getUserNotes);
router.get("/notes/:noteId", verifyUserToken, noteController.getNote);
router.delete("/notes/:noteId", verifyUserToken, noteController.deleteNote);

module.exports = router;
