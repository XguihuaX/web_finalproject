// 时间更新功能
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const month = now.toLocaleString('zh-CN', { month: 'long' });
    const day = now.getDate();
    timeElement.textContent = `${hours}:${minutes} - ${month} ${day}`;
}
setInterval(updateTime, 60000);
updateTime();

// 背景选择功能
document.getElementById('background-select').addEventListener('change', function (e) {
    const backgrounds = {
        'paper': '/public/images/basic_background.jpg',
        'custom1': '/public/images/custom_background_1.jpg',
        'custom2': '/public/images/custom_background_2.jpg'
    };
    const selectedBackground = backgrounds[e.target.value];
    if (selectedBackground) {
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    }
});

// 侧边栏切换功能
document.getElementById('sidebar-toggle').addEventListener('click', () => {
    document.body.classList.toggle('sidebar-closed');
});

// 天气查询功能
document.getElementById('city-button').addEventListener('click', async () => {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return alert('请输入城市名称！');
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=YOUR_API_KEY&units=metric`);
        //show error details
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
        }
        const data = await response.json();
        document.getElementById('weather').textContent = `${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
    } catch (error) {
        document.getElementById('weather').textContent = '无法获取天气。';
        console.error(error);
    }
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
    if (!noteText) return alert('请输入笔记内容！');
    try {
        const response = await fetch('/api/user/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ context: noteText }),
        });
        if (!response.ok) throw new Error('添加笔记失败！');
        else console.log(response);
        alert('笔记添加成功！');
        document.getElementById('note-text').value = '';
        toggleModal('note-modal', 'add');
    } catch (error) {
        alert(`错误：${error.message}`);
        console.error(error);
    }
});

// 删除笔记功能
document.getElementById('delete-note-button').addEventListener('click', async () => {
    const noteId = document.getElementById('delete-note-id').value.trim();
    if (!noteId) return alert('请输入要删除的笔记ID！');
    try {
        const response = await fetch(`/api/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('删除笔记失败！');
        alert('笔记删除成功！');
        document.getElementById('delete-note-id').value = '';
    } catch (error) {
        alert(`错误：${error.message}`);
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
        if (!response.ok) throw new Error('图片上传失败！');
        alert('图片上传成功！');
        toggleModal('add-image-modal', 'add');
    } catch (error) {
        alert(`错误：${error.message}`);
        console.error(error);
    }
}

// 删除图片功能
document.getElementById('delete-image-button').addEventListener('click', async () => {
    const imageId = document.getElementById('image-id-input').value.trim();
    if (!imageId) return alert('请输入要删除的图片ID！');
    try {
        const response = await fetch(`/api/user/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('删除图片失败！');
        alert('图片删除成功！');
        document.getElementById('image-id-input').value = '';
    } catch (error) {
        alert(`错误：${error.message}`);
        console.error(error);
    }
});

// 页面加载时初始化数据
renderNotes();
