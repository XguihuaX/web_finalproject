document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // 阻止表单默认提交（避免页面刷新）

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // 检查字段是否为空
    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    try {
        // 使用 Fetch API 向后端发送登录请求
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            // 登录成功，跳转到用户主页或仪表盘
            alert('Login successful!');
            window.location.href = '/user/dashboard';
        } else {
            // 显示后端返回的错误信息
            alert(`Login failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
    }
});

