// 时间显示更新
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

// 背景切换
document.getElementById('background-select').addEventListener('change', function (e) {
    const backgrounds = {
        'paper': '/public/images/basic_background.jpg',
        'custom1': 'YOUR_CUSTOM_BACKGROUND_1_URL',
        'custom2': 'YOUR_CUSTOM_BACKGROUND_2_URL'
    };
    const selectedBackground = backgrounds[e.target.value];
    if (selectedBackground) {
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    }
});

// 天气 API 查询
async function getWeatherByCity(city) {
    const apiKey = 'YOUR_OPENWEATHER_API_KEY';
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        if (!response.ok) throw new Error('Weather query failed.');
        const data = await response.json();
        document.getElementById('weather').textContent = `${data.name}: ${data.weather[0].description}, ${data.main.temp}°C`;
    } catch (error) {
        console.error(error);
        document.getElementById('weather').textContent = 'Unable to fetch weather.';
    }
}
document.getElementById('city-button').addEventListener('click', () => {
    const city = document.getElementById('city-input').value.trim();
    if (city) getWeatherByCity(city);
});

// 显示/隐藏弹窗
function toggleModal(modalId, action) {
    document.getElementById(modalId).classList[action]('hidden');
}

// 笔记操作
async function renderNotes() {
    try {
        const response = await fetch('/api/user/notes', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch notes.');

        const notes = await response.json();
        const noteListContainer = document.getElementById('note-list');
        noteListContainer.innerHTML = ''; // 清空旧笔记

        notes.forEach(note => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            noteItem.innerHTML = `
                <div>${note.context}</div>
                <button data-id="${note.noteId}" class="delete-note-button">Delete</button>
            `;
            noteListContainer.appendChild(noteItem);
        });

        // 绑定删除按钮事件
        document.querySelectorAll('.delete-note-button').forEach(button => {
            button.addEventListener('click', async () => {
                const noteId = button.dataset.id;
                await deleteNote(noteId);
                renderNotes(); // 删除后重新加载笔记列表
            });
        });
    } catch (error) {
        console.error(error);
        alert('Error fetching notes.');
    }
}

async function addNote() {
    const noteText = document.getElementById('note-text').value.trim();
    if (!noteText) {
        alert('Please enter some text for the note.');
        return;
    }
    try {
        const response = await fetch('/api/user/notes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ context: noteText }),
        });

        if (!response.ok) throw new Error('Failed to save note.');

        document.getElementById('note-text').value = ''; // 清空输入框
        alert('Note added successfully!');
        renderNotes(); // 重新加载笔记列表
    } catch (error) {
        console.error(error);
        alert('Error adding note.');
    }
}

async function deleteNote(noteId) {
    try {
        const response = await fetch(`/api/user/notes/${noteId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete note.');

        alert('Note deleted successfully!');
    } catch (error) {
        console.error(error);
        alert('Error deleting note.');
    }
}
document.getElementById('save-note-button').addEventListener('click', addNote);

// 图片操作
document.getElementById('upload-image-button').addEventListener('click', async () => {
    const fileInput = document.getElementById('image-upload');
    const formData = new FormData();
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select an image to upload.');
        return;
    }
    formData.append('image', file);
    try {
        const response = await fetch('/api/user/images', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });
        if (!response.ok) throw new Error('Failed to upload image.');
        alert('Image uploaded successfully!');
        toggleModal('add-image-modal', 'add'); // 关闭上传弹窗
    } catch (error) {
        console.error(error);
        alert('Error uploading image.');
    }
});

document.getElementById('delete-image-button').addEventListener('click', async () => {
    const imageId = document.getElementById('image-id-input').value.trim();
    if (!imageId) {
        alert('Please enter an image ID.');
        return;
    }
    try {
        const response = await fetch(`/api/user/images/${imageId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete image.');
        alert('Image deleted successfully!');
        toggleModal('delete-image-modal', 'add'); // 关闭删除弹窗
    } catch (error) {
        console.error(error);
        alert('Error deleting image.');
    }
});

// 页面加载时初始化数据
renderNotes();
