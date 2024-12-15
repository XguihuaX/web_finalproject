const Note = require("../models/note.js");

// 添加笔记
exports.addNote = async (req, res) => {
  try {
    console.log("Request headers:", req.headers);
    console.log("Request body:", req.body);
    console.log("User info from token:", req.user);

    // 检查请求体是否存在
    if (!req.body) {
      return res.status(400).json({ message: "请求体不能为空" });
    }

    // 检查笔记内容是否存在
    if (!req.body.context) {
      return res.status(400).json({ message: "笔记内容为必填项" });
    }

    // 检查用户信息是否存在
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: "用户未认证" });
    }

    const { context } = req.body;
    const userId = req.user.userId;

    // 验证笔记内容长度
    if (context.length > 10000) {
      return res.status(400).json({ message: "笔记内容超出长度限制" });
    }

    console.log("Creating note with:", { userId, context });

    const note = new Note({ userId, context });
    console.log("Note model instance:", note);

    const savedNote = await note.save();
    console.log("Saved note:", savedNote);

    if (!savedNote) {
      return res.status(500).json({ message: "保存笔记失败" });
    }

    res.status(201).json({
      noteId: savedNote.noteId,
      userId: savedNote.userId,
      context: savedNote.context,
      createdAt: savedNote.createdAt,
    });
  } catch (err) {
    console.error("Error creating note:", err);
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "笔记数据验证失败", details: err.message });
    }
    res.status(500).json({ message: "服务器内部错误", details: err.message });
  }
};

// 删除笔记
exports.deleteNote = async (req, res) => {
  try {
    if (!req.params.noteId) {
      return res.status(400).json({ message: "笔记ID为必填项" });
    }

    const noteId = parseInt(req.params.noteId);
    if (isNaN(noteId)) {
      return res.status(400).json({ message: "无效的笔记ID格式" });
    }

    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "用户未认证" });
    }

    const note = await Note.findOne({ noteId });
    if (!note) {
      return res.status(404).json({ message: "未找到该笔记" });
    }

    if (note.userId !== userId) {
      return res.status(403).json({ message: "无权删除此笔记" });
    }

    const result = await Note.deleteOne({ noteId });
    if (result.deletedCount === 0) {
      return res.status(500).json({ message: "删除笔记失败" });
    }

    res.json({ message: "笔记删除成功" });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ message: "服务器内部错误", details: err.message });
  }
};

// 获取用户的笔记列表
exports.getUserNotes = async (req, res) => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "用户未认证" });
    }

    const notes = await Note.find({ userId }).sort({ createdAt: -1 });
    if (!notes) {
      return res.status(500).json({ message: "获取笔记列表失败" });
    }

    res.json(
      notes.map((note) => ({
        noteId: note.noteId,
        userId: note.userId,
        context: note.context,
        createdAt: note.createdAt,
      }))
    );
  } catch (err) {
    console.error("Error getting user notes:", err);
    res.status(500).json({ message: "服务器内部错误", details: err.message });
  }
};

// 获取单个笔记
exports.getNote = async (req, res) => {
  try {
    if (!req.params.noteId) {
      return res.status(400).json({ message: "笔记ID为必填项" });
    }

    const noteId = parseInt(req.params.noteId);
    if (isNaN(noteId)) {
      return res.status(400).json({ message: "无效的笔记ID格式" });
    }

    const userId = req.user.userId;
    if (!userId) {
      return res.status(401).json({ message: "用户未认证" });
    }

    const note = await Note.findOne({ noteId });
    if (!note) {
      return res.status(404).json({ message: "未找到该笔记" });
    }

    if (note.userId !== userId) {
      return res.status(403).json({ message: "无权查看此笔记" });
    }

    res.json({
      noteId: note.noteId,
      userId: note.userId,
      context: note.context,
      createdAt: note.createdAt,
    });
  } catch (err) {
    console.error("Error getting note:", err);
    res.status(500).json({ message: "服务器内部错误", details: err.message });
  }
};
