const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");

// 引入路由
const authRoutes = require("./routes/authRoutes.js"); // 认证相关API
const userRoutes = require("./routes/userRoutes.js"); // 用户相关API
const adminRoutes = require("./routes/adminRoute.js"); // 管理员相关API
const indexRoutes = require("./routes/indexRoutes.js"); // 前端页面的路由
const authPageRoutes = require("./routes/authPage.js"); // 前端认证页面路由
const userPageRoutes = require("./routes/userPage.js"); // 前端用户页面路由
const adminPageRoutes = require("./routes/adminPage.js"); // 前端管理员页面路由

// 初始化 Express 应用
const app = express();

// MongoDB 连接
mongoose
  .connect("mongodb://127.0.0.1:27017/web_final", {
    useNewUrlParser: true,
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(() => console.log("MongoDB 连接成功"))
  .catch((err) => {
    console.error("MongoDB 连接失败：", err);
    process.exit(1);
  });

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件
app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "public/images")));

// 设置视图引擎为 EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// 路由配置（API）
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

// 路由配置（前端页面）
app.use("/", indexRoutes); // 首页
app.use("/auth", authPage); // 登录/注册页面
app.use("/user", userPage); // 用户页面
app.use("/admin", adminPage); // 管理员页面

// 错误处理中间件
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: "服务器内部错误" });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器正在运行：http://localhost:${PORT}`);
});
