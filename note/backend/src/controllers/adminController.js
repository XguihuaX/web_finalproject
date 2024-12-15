const User = require("../models/user.js");
const Image = require("../models/image.js");
const Note = require("../models/note.js");

// 用户管理
exports.getAllUsers = async (_req, res) => {
  try {
    const users = await User.find().select("userId username status -_id");
    res.json({ data: users });
  } catch (_err) {
    res.status(500).json({ message: "获取用户列表失败" });
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId }).select(
      "userId username status -_id"
    );
    if (!user) {
      return res.status(404).json({ message: "未找到该用户" });
    }
    res.json({ data: user });
  } catch (_err) {
    res.status(500).json({ message: "获取用户信息失败" });
  }
};

exports.deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "未找到该用户" });
    }
    await User.deleteOne({ userId });
    res.json({ message: "用户删除成功" });
  } catch (_err) {
    res.status(500).json({ message: "删除用户失败" });
  }
};
// 笔记管理
exports.getAllNotes = async (_req, res) => {
  try {
    const notes = await Note.find();
    res.json({ data: notes });
  } catch (_err) {
    res.status(500).json({ message: "获取笔记列表失败" });
  }
};

exports.getNoteById = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findOne({ noteId });
    if (!note) {
      return res.status(404).json({ message: "未找到该笔记" });
    }
    res.json({ data: note });
  } catch (_err) {
    res.status(500).json({ message: "获取笔记信息失败" });
  }
};

exports.deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findOne({ noteId });
    if (!note) {
      return res.status(404).json({ message: "未找到该笔记" });
    }
    await Note.deleteOne({ noteId });
    res.json({ message: "笔记删除成功" });
  } catch (_err) {
    res.status(500).json({ message: "删除笔记失败" });
  }
};

// 图片管理
exports.getAllImages = async (_req, res) => {
  try {
    const images = await Image.find();
    res.json({ data: images });
  } catch (_err) {
    res.status(500).json({ message: "获取图片列表失败" });
  }
};

exports.getImageById = async (req, res) => {
  const { imageId } = req.params;
  try {
    const image = await Image.findOne({ imageId });
    if (!image) {
      return res.status(404).json({ message: "未找到该图片" });
    }
    res.json({ data: image });
  } catch (_err) {
    res.status(500).json({ message: "获取图片信息失败" });
  }
};

exports.deleteImage = async (req, res) => {
  const { imageId } = req.params;
  try {
    const image = await Image.findOne({ imageId });
    if (!image) {
      return res.status(404).json({ message: "未找到该图片" });
    }
    await Image.deleteOne({ imageId });
    res.json({ message: "图片删除成功" });
  } catch (_err) {
    res.status(500).json({ message: "删除图片失败" });
  }
};
