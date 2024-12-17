const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require('dotenv').config(); // Load environment variables

// 引入路由
const adminRoutes = require("./routes/adminRoute.js"); // 管理员相关API
const indexRoutes = require("./routes/indexRoutes.js"); // 前端页面的路由
const authPageRoutes = require("./routes/authPage.js"); // 前端认证页面路由
const userPageRoutes = require("./routes/userRoutes.js"); // 前端用户页面路由
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
app.use("/api/auth", authPageRoutes);
app.use("/api/user", userPageRoutes);
app.use("/api/admin", adminRoutes);

// 路由配置（前端页面）
app.use("/", indexRoutes); // 首页
app.use("/auth", authPageRoutes); // 登录/注册页面
app.use("/user", userPageRoutes); // 用户页面
app.use("/admin", adminPageRoutes); // 管理员页面

// Load API key from .env file
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;

// Backend route to fetch weather data securely
app.get('/api/weather', async (req, res) => {
  const { latitude, longitude } = req.query;

  // Validate query parameters
  if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
  }

  try {
      // Call OpenWeatherMap API securely
      const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}&units=metric&lang=en`
      );

      if (!weatherResponse.ok) {
          throw new Error('Weather API request failed');
      }

      const data = await weatherResponse.json();
      res.json(data); // Send the weather data to the client
  } catch (error) {
      console.error('Error fetching weather:', error.message);
      res.status(500).json({ message: 'Unable to fetch weather information' });
  }
});

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
