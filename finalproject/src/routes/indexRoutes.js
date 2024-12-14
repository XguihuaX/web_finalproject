const express = require('express');
const router = express.Router();

// 首页路由
router.get('/', (req, res) => {
    res.render('index'); // 渲染 index.ejs
});
