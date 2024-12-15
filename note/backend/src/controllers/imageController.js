const Image = require("../models/image.js");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");

// 确保上传目录存在
const uploadDir = "src/public/images";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created upload directory: ${uploadDir}`);
}

// 配置 multer 存储
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    console.log("Multer destination:", uploadDir);
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    console.log("Generated filename:", uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    console.log("Received file:", file);
    // 检查文件类型
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("只允许上传图片文件"));
    }
    cb(null, true);
  },
}).single("image");

// 添加图片
exports.addImage = async (req, res) => {
  console.log("Starting image upload...");
  console.log("Request headers:", req.headers);

  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      console.error("Multer error:", err);
      return res
        .status(400)
        .json({ message: "文件上传错误", details: err.message });
    }
    if (err) {
      console.error("Upload error:", err);
      return res
        .status(500)
        .json({ message: "服务器错误", details: err.message });
    }

    console.log("File upload completed");
    console.log("Request file:", req.file);

    if (!req.file) {
      console.error("No file uploaded");
      return res.status(400).json({ message: "图片文件为必填项" });
    }

    try {
      const userId = req.user.userId;
      const imageUrl = `/images/${req.file.filename}`;
      console.log("Creating image record:", { userId, imageUrl });

      const image = new Image({
        imageUrl,
        userId,
      });

      const savedImage = await image.save();
      console.log("Saved image:", savedImage);

      return res.status(201).json({
        imageId: savedImage.imageId,
        imageUrl: savedImage.imageUrl,
        userId: savedImage.userId,
      });
    } catch (error) {
      console.error("Error saving image:", error);
      return res
        .status(500)
        .json({ message: "保存图片失败", details: error.message });
    }
  });
};

// 获取用户的图片列表
exports.getImages = async (req, res) => {
  console.log("Getting images for user:", req.user.userId);
  const userId = req.user.userId;

  try {
    const images = await Image.find({ userId }).sort({ createdAt: -1 });
    console.log("Found images:", images);
    return res.json(
      images.map((image) => ({
        imageId: image.imageId,
        userId: image.userId,
        imageUrl: image.imageUrl,
      }))
    );
  } catch (error) {
    console.error("Error getting images:", error);
    return res
      .status(500)
      .json({ message: "获取图片列表失败", details: error.message });
  }
};

// 获取单个图片
exports.getImage = async (req, res) => {
  const imageId = parseInt(req.params.imageId, 10);
  const userId = req.user.userId;
  console.log("Getting image:", { imageId, userId });

  try {
    const image = await Image.findOne({ imageId, userId });
    console.log("Found image:", image);

    if (!image) {
      return res.status(404).json({ message: "未找到该图片" });
    }
    return res.json({
      imageId: image.imageId,
      userId: image.userId,
      imageUrl: image.imageUrl,
    });
  } catch (error) {
    console.error("Error getting image:", error);
    return res
      .status(500)
      .json({ message: "获取图片失败", details: error.message });
  }
};

// 删除图片
exports.deleteImage = async (req, res) => {
  const imageId = parseInt(req.params.imageId, 10);
  const userId = req.user.userId;
  console.log("Deleting image:", { imageId, userId });

  try {
    const image = await Image.findOne({ imageId, userId });
    console.log("Found image to delete:", image);

    if (!image) {
      return res.status(404).json({ message: "未找到该图片" });
    }

    // 删除文件系统中的图片
    const imagePath = path.join(uploadDir, path.basename(image.imageUrl));
    console.log("Deleting file:", imagePath);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
      console.log("Image file deleted");
    }

    await Image.deleteOne({ imageId, userId });
    console.log("Image record deleted");

    return res.json({ message: "图片删除成功" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res
      .status(500)
      .json({ message: "删除图片失败", details: error.message });
  }
};
