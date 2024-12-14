const express = require('express');
const router = express.Router();

// 渲染用户页面
router.get('/adminpage', (req, res) => {
    res.render('user/adminPage'); // 确保路径和文件名一致
});

module.exports = router;
