// 时间更新功能
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const month = now.toLocaleString('zh-US', { month: 'long' });
    const day = now.getDate();
    timeElement.textContent = `${hours}:${minutes} - ${month} ${day}`;
}
setInterval(updateTime, 60000);
updateTime();

// 背景选择功能
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

document.getElementById('logout-button').addEventListener('click', () => {
    // 执行登出逻辑（例如清除本地存储中的 token）
    localStorage.removeItem('token');

    // 跳转到 index.ejs（或指定路径的页面）
    window.location.href = '/index';
});

// 侧边栏切换功能
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-closed');
});

// 天气查询功能
document.getElementById('city-button').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return alert('Please input the city name!');

    try {
        // Call the backend API
        const response = await fetch(`/api/weather/city?city=${encodeURIComponent(city)}`);
        if (!response.ok) throw new Error('Weather search failed!');

        const data = await response.json();
        document.getElementById('weather').textContent = 
            `${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
    } catch (error) {
        document.getElementById('weather').textContent = 'Cannot get weather.';
        console.error(error);
    }
});


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

async function callLLMAPI(query) {
    try {
        const response = await fetch('/api/llm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) throw new Error('Backend API call failed');

        const data = await response.json();
        return data.content; // Return the content from the backend
    } catch (error) {
        console.error('Error:', error.message);
        return 'Sorry, API request failed. Please try again later.';
    }
}

document.getElementById('llm-button').addEventListener('click', async () => {
    const query = document.getElementById('llm-input').value;
    const responseElement = document.getElementById('llm-response');
    if (!query.trim()) return alert('Please enter a query.');
    responseElement.textContent = 'Processing...';
    const response = await callLLMAPI(query);
    responseElement.textContent = response;
});

// 模态框显示/隐藏功能
function toggleModal(modalId, action) {
    document.getElementById(modalId).classList[action]('hidden');
}

// 笔记管理功能
document.getElementById('open-note-modal').addEventListener('click', () => toggleModal('note-modal', 'remove'));
document.getElementById('close-note-modal').addEventListener('click', () => toggleModal('note-modal', 'add'));

// 添加笔记功能
document.getElementById('save-note-button').addEventListener('click', async () => {
    const noteText = document.getElementById('note-text').value.trim();
    if (!noteText) return alert('please input text！');
    try {
        const response = await fetch('/api/user/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ context: noteText }),
        });
        if (!response.ok) throw new Error('add note failed！');
        alert('add note succuessed！');
        document.getElementById('note-text').value = '';
        toggleModal('note-modal', 'add');
    } catch (error) {
        alert(`error：${error.message}`);
        console.error(error);
    }
});

// 删除笔记功能
document.getElementById('delete-note-button').addEventListener('click', async () => {
    const noteId = document.getElementById('delete-note-id').value.trim();
    if (!noteId) return alert('please input image ID you want to delete！');
    try {
        const response = await fetch(`/api/user/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('delete failed！');
        alert('delete success！');
        document.getElementById('delete-note-id').value = '';
    } catch (error) {
        alert(`error：${error.message}`);
        console.error(error);
    }
});

// 图片管理功能
document.getElementById('open-add-image-modal').addEventListener('click', () => toggleModal('add-image-modal', 'remove'));
document.getElementById('close-add-image-modal').addEventListener('click', () => toggleModal('add-image-modal', 'add'));

// 拖放上传图片功能
const dropZone = document.getElementById('image-drop-zone');
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragging');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragging'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragging');
    const file = e.dataTransfer.files[0];
    if (file) {
        uploadImage(file);
    }
});

// 点击选择文件上传功能
dropZone.addEventListener('click', () => {
    const fileInput = document.getElementById('image-upload');
    fileInput.click();
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            uploadImage(file);
        }
    });
});

// 上传图片功能
async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    try {
        const response = await fetch('/api/user/images', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });
        if (!response.ok) throw new Error('image upload failed！');
        alert('iamge upload success！');
        toggleModal('add-image-modal', 'add');
    } catch (error) {
        alert(`error：${error.message}`);
        console.error(error);
    }
}

// 删除图片功能
document.getElementById('delete-image-button').addEventListener('click', async () => {
    const imageId = document.getElementById('image-id-input').value.trim();
    if (!imageId) return alert('input the image ID you want to delete！');
    try {
        const response = await fetch(`/api/user/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('failed！');
        alert('successed！');
        document.getElementById('image-id-input').value = '';
    } catch (error) {
        alert(`error：${error.message}`);
        console.error(error);
    }
});

// 页面加载时初始化数据
renderNotes();
