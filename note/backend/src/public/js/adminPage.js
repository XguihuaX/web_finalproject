/** ==============================
 *  1. 时间显示功能
 ============================== */
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();
    timeElement.textContent = `${hours}:${minutes} - ${month} ${day}`;
}
setInterval(updateTime, 60000);
updateTime();

/** ==============================
 *  2. 背景切换功能
 ============================== */
document.getElementById('background-select').addEventListener('change', function (e) {
    const backgrounds = {
        'paper': '/public/images/basic_background.jpg',
        'custom1': '/public/images/default.png',
    };
    const selectedBackground = backgrounds[e.target.value];
    if (selectedBackground) {
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    }
});

/** ==============================
 *  3. 天气查询功能
 ============================== */
 async function getWeatherByLocation(latitude, longitude) {
    const weatherElement = document.getElementById('weather');
    try {
        // Call your backend route
        const response = await fetch(
            `/api/weather?latitude=${latitude}&longitude=${longitude}`
        );

        if (!response.ok) throw new Error('Weather query failed');

        const data = await response.json();
        weatherElement.textContent = `${data.name}: ${data.weather[0].description}, ${data.main.temp.toFixed(1)}°C`;
    } catch (error) {
        weatherElement.textContent = 'Unable to fetch weather information';
        console.error('Error:', error.message);
    }
}


function fetchWeatherUsingCurrentLocation() {
    const weatherElement = document.getElementById('weather');
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByLocation(latitude, longitude);
            },
            () => getWeatherByLocation(40.4406, -79.9959) // Default to Pittsburgh
        );
    } else getWeatherByLocation(40.4406, -79.9959);
}
fetchWeatherUsingCurrentLocation();

/** ==============================
 *  4. 登出功能
 ============================== */
document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/index';
});

/** ==============================
 *  5. LLM API 和文本转语音
 ============================== */
async function callLLMAPI(query) {
    const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';
    const responseElement = document.getElementById('llm-response');
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini',
                messages: [{ role: 'user', content: query }],
            }),
        });
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        responseElement.textContent = 'Error: Unable to process request.';
        return '';
    }
}


/** ==============================
 *  6. 用户、笔记、图片管理 API 调用
 ============================== */
const adminOutput = document.getElementById('admin-output');

async function sendAdminRequest(url, method = 'GET', body = null) {
    try {
        console.log("Requesting:", url);

        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error("Authentication token not found. Please log in.");
        }

        // Prepare request options with authentication
        const options = { 
            method, 
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Add token for authentication
            } 
        };

        // Make the request
        const response = await fetch(url, options);
        let data;

        // Attempt to parse JSON
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error("Invalid JSON response from server"+jsonError);
        }

        // Check if the response is successful
        if (!response.ok) {
            throw new Error(data.message || `Request failed with status ${response.status}`);
        }

        // Handle successful response
        console.log("API Response:", data);
        adminOutput.textContent = JSON.stringify(data, null, 2);
    } catch (error) {
        // Handle network errors or other issues
        if (error.name === "TypeError" && error.message === "Failed to fetch") {
            adminOutput.textContent = "Network error: Unable to connect to the server.";
        } else {
            adminOutput.textContent = `Error: ${error.message}`;
        }
        console.error("Request Error:", error.message);
    }
}


// 用户管理
document.getElementById('view-users').addEventListener('click', () => sendAdminRequest('/api/admin/users'));
document.getElementById('view-user').addEventListener('click', () => {
    const userId = document.getElementById('user-id-input').value.trim();
    if (!userId) return alert('Please enter a User ID');
    sendAdminRequest(`/api/admin/users/${userId}`);
});
document.getElementById('delete-user').addEventListener('click', () => {
    const userId = document.getElementById('user-id-input').value.trim();
    if (!userId) return alert('Please enter a User ID');
    sendAdminRequest(`/api/admin/users/${userId}`, 'DELETE');
});

// 笔记管理
document.getElementById('view-notes').addEventListener('click', () => sendAdminRequest('/api/admin/notes'));
document.getElementById('view-note').addEventListener('click', () => {
    const noteId = document.getElementById('note-id-input').value.trim();
    if (!noteId) return alert('Please enter a Note ID');
    sendAdminRequest(`/api/admin/notes/${noteId}`);
});
document.getElementById('delete-note').addEventListener('click', () => {
    const noteId = document.getElementById('note-id-input').value.trim();
    if (!noteId) return alert('Please enter a Note ID');
    sendAdminRequest(`/api/admin/notes/${noteId}`, 'DELETE');
});

// 图片管理
document.getElementById('view-images').addEventListener('click', () => sendAdminRequest('/api/admin/images'));
document.getElementById('view-image').addEventListener('click', () => {
    const imageId = document.getElementById('image-id-input').value.trim();
    if (!imageId) return alert('Please enter an Image ID');
    sendAdminRequest(`/api/admin/images/${imageId}`);
});
document.getElementById('delete-image').addEventListener('click', () => {
    const imageId = document.getElementById('image-id-input').value.trim();
    if (!imageId) return alert('Please enter an Image ID');
    sendAdminRequest(`/api/admin/images/${imageId}`, 'DELETE');
});

/** ==============================
 *  7. 侧边栏切换功能
 ============================== */
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-closed');
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') document.body.classList.toggle('sidebar-closed');
});
