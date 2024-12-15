const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const process = require("node:process");
const cors = require("cors");

// 路由引入
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const adminRoutes = require("./routes/adminRoute.js");
const { indexRoutes } = require("./routes/indexRoutes.js");

// 创建 Express 实例
const app = express();

// 设置视图引擎为 EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// MongoDB 连接
mongoose
  .connect("mongodb://127.0.0.1:27017/web_final", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// 中间件配置
app.use(cors());
app.use(express.json()); // 用于解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 用于解析 URL 编码的请求体

// 静态文件配置
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 路由配置
app.use("/api/auth", authRoutes); // 后端 API 路由
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/", indexRoutes); // 前端页面的路由

// 渲染首页
app.get("/", (req, res) => {
  res.render("index");
});

// 错误处理中间件
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "服务器内部错误" });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
