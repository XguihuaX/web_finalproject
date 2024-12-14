
document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // 阻止表单默认提交（避免页面刷新）

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const status = document.getElementById('status').value;

    // 检查字段是否为空
    if (!username || !password) {
        alert('Username and password are required.');
        return;
    }

    try {
        // 使用 Fetch API 向后端发送注册请求
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                status,
            }),
        });

        const result = await response.json();

        if (response.ok) {
            // 注册成功，跳转到登录页面
            alert('Registration successful! Please login.');
            window.location.href = '/auth/login';
        } else {
            // 显示后端返回的错误信息
            alert(`Registration failed: ${result.message}`);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred. Please try again.');
    }
});
