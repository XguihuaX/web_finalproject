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
        // Send login request to the backend
        const response = await fetch('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
    
        const result = await response.json();
    
        if (response.ok) {
          // Store token in localStorage
          localStorage.setItem("token", result.token);
          alert('Login successful!');
    
          // Redirect user based on their status
          if (result.user.status === "admin") {
            window.location.href = "/admin/adminpage";
          } else if (result.user.status === "user") {
            window.location.href = "/user/userpage";
          } else {
            alert("Unknown user status. Please contact support.");
          }
        } else {
          // Handle login failure
          alert(`Login failed: ${result.message}`);
        }
      } catch (error) {
        console.error('Error during login:', error);
        alert('An error occurred. Please try again.');
      }
});

