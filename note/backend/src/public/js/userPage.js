// 时间更新功能
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

// 背景选择功能
document.getElementById('background-select').addEventListener('change', function (e) {
    const backgrounds = {
        'paper': '/public/images/basic_background.jpg',
        'custom1': '/public/images/default.png',
    };

    // 如果是上传的图片，直接使用选项值作为路径
    const selectedBackground = backgrounds[e.target.value] || e.target.value;

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

async function renderNotes() {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) {
        console.error('Error: #notes-container not found in the DOM');
        return;
    }

    try {
        const response = await fetch('/api/user/notes', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch notes!');

        const notes = await response.json();
        console.log("Fetched Notes:", notes); // 输出调试数据

        notesContainer.innerHTML = ''; // 清空之前的内容

        notes.forEach(note => {
            // 使用 noteId 代替 undefined
            const noteId = note.noteId || 'Unknown ID';
            const noteText = note.context || 'No Content';

            const noteElement = document.createElement('div');
            noteElement.classList.add('note');
            noteElement.textContent = `${noteId}: ${noteText}`; // 显示 ID 和内容
            notesContainer.appendChild(noteElement);
        });
    } catch (error) {
        console.error('Error fetching notes:', error);
        alert(`Error: ${error.message}`);
    }
}





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

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Image upload failed!');
        }

        const result = await response.json(); // 获取返回的图片信息
        console.log('Uploaded Image Info:', result);

        // 显示上传的图片
        displayUploadedImage(result.imageUrl);
        alert('Image uploaded successfully!');
        toggleModal('add-image-modal', 'add'); // 关闭模态框
    } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Image upload error:', error);
    }
}

// 显示上传的图片到 notes-container 下方
function displayUploadedImage(imageUrl) {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) {
        console.error('Error: #notes-container not found in the DOM');
        return;
    }

    // 创建图片元素
    const imgElement = document.createElement('img');
    imgElement.src = imageUrl; // 使用服务器返回的 imageUrl
    imgElement.alt = 'Uploaded Image';
    imgElement.style.maxWidth = '300px';
    imgElement.style.marginTop = '10px';
    imgElement.style.border = '1px solid #ccc';
    imgElement.style.borderRadius = '5px';
    imgElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';

    // 将图片添加到 notes-container 中
    notesContainer.appendChild(imgElement);
}


async function fetchAndDisplayImages() {
    const notesContainer = document.getElementById('notes-container');
    if (!notesContainer) {
        console.error('Error: #notes-container not found in the DOM');
        return;
    }

    try {
        const response = await fetch('/api/user/images', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch images!');

        const images = await response.json();
        console.log('Fetched Images:', images);

        // 清空之前的内容
        notesContainer.innerHTML = '';

        // 遍历图片列表，显示图片
        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.imageUrl;
            imgElement.alt = `Image ID: ${image.imageId}`;
            imgElement.style.maxWidth = '300px';
            imgElement.style.marginTop = '10px';
            imgElement.style.border = '1px solid #ccc';
            imgElement.style.borderRadius = '5px';
            imgElement.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            notesContainer.appendChild(imgElement);
        });
    } catch (error) {
        console.error('Error fetching images:', error);
        alert(`Error: ${error.message}`);
    }
}



// 动态添加背景选项
function addBackgroundOption(imagePath) {
    const backgroundSelect = document.getElementById('background-select');

    const newOption = document.createElement('option');
    newOption.value = imagePath; // 使用文件路径作为选项值
    newOption.textContent = `Custom Background (${backgroundSelect.options.length - 2})`; // 设置显示名称
    backgroundSelect.appendChild(newOption);
}


// 文件选择功能
const fileInput = document.getElementById('image-upload');
let selectedFile = null;

fileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0]; // 保存用户选择的文件
    if (selectedFile) {
        console.log('Selected file:', selectedFile);
        alert(`File selected: ${selectedFile.name}`);
    }
});

// 上传按钮点击事件
document.getElementById('upload-image-button').addEventListener('click', () => {
    if (selectedFile) {
        uploadImage(selectedFile); // 调用上传函数
    } else {
        alert('Please select a file before uploading!');
    }
});

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
