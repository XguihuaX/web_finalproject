const express = require('express');
const router = express.Router();

// 显示注册页面
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// 处理注册表单提交
router.post('/register', (req, res) => {
    const { username, password, status } = req.body;

    // 示例逻辑：注册数据验证和保存
    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // 假设使用数据库保存用户数据
    // 示例代码：模拟注册成功
    res.status(201).json({ success: true, message: 'Registration successful!' });
});

// 显示登录页面
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// 处理登录表单提交
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // 示例逻辑：登录验证
    if (username === 'admin' && password === '123456') {
        return res.json({ success: true, message: 'Login successful!', redirect: '/user/dashboard' });
    } else {
        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    }
});

module.exports = router;
