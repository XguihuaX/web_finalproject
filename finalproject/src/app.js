const express = require('express');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // 引入 authRoutes

const app = express();

// 设置视图引擎为 EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中间件
app.use(express.json()); // 用于解析 JSON 请求体
app.use(express.urlencoded({ extended: true })); // 用于解析 URL 编码的请求体
app.use('/public', express.static(path.join(__dirname, 'public'))); // 配置静态文件路径

// 路由
app.use('/auth', authRoutes); // 挂载 authRoutes 到 /auth
app.get('/', (req, res) => {
    res.render('index'); // 渲染首页
});

const userRoutes = require('./routes/userRoutes'); // 引入 userRoutes
app.use('/user', userRoutes); // 挂载到 /user 路径

const adminRoutes = require('./routes/adminRoutes'); // 引入 adminRoutes
app.use('/user', adminRoutes); // 挂载到 /user 路径

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
