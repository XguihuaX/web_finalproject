// Update time display
function updateTime() {
    const timeElement = document.getElementById('time');
    const now = new Date();

    // Format time: hours and minutes
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // Format date: month and day
    const month = now.toLocaleString('en-US', { month: 'long' });
    const day = now.getDate();

    // Update page content with English format
    timeElement.textContent = `${hours}:${minutes} - ${month} ${day}`;
}
document.getElementById('background-select').addEventListener('change', function(e) {
    const backgrounds = {
        'paper': 'https://cdn.glitch.global/9f5eb1bc-8b6e-4076-9967-025ad2d899b9/paper.jpg?v=1733172469163',
        'custom1': 'YOUR_CUSTOM_BACKGROUND_1_URL',
        'custom2': 'YOUR_CUSTOM_BACKGROUND_2_URL'
    };
    
    const selectedBackground = backgrounds[e.target.value];
    if (selectedBackground) {
        document.body.style.backgroundImage = `url('${selectedBackground}')`;
    }
});
// Update time every minute
setInterval(updateTime, 60000);
updateTime(); // Update immediately on page load

// Get weather information by coordinates
async function getWeatherByLocation(latitude, longitude) {
    const apiKey = 'f8f0f918c0c7695dbae5f4c687a1de14';
    const weatherElement = document.getElementById('weather');

    try {
        console.log(`Querying weather: Latitude ${latitude}, Longitude ${longitude}`);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric&lang=en`
        );
        if (!response.ok) throw new Error('Weather query failed');
        const data = await response.json();
        console.log('Weather data received:', data);
        const cityName = data.name;
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp.toFixed(1);
        weatherElement.textContent = `${cityName}: ${weatherDescription}, ${temperature}°C`;
    } catch (error) {
        weatherElement.textContent = 'Unable to fetch weather information';
        console.error('Weather query error:', error);
    }
}

// Get weather information by city name
async function getWeatherByCity(cityName) {
    const apiKey = 'f8f0f918c0c7695dbae5f4c687a1de14';
    const weatherElement = document.getElementById('weather');

    try {
        console.log(`Querying weather for city: ${cityName}`);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${apiKey}&units=metric&lang=en`
        );
        if (!response.ok) throw new Error('Weather query failed');
        const data = await response.json();
        console.log('Weather data received:', data);
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp.toFixed(1);
        weatherElement.textContent = `${cityName}: ${weatherDescription}, ${temperature}°C`;
    } catch (error) {
        weatherElement.textContent = 'City not found or unable to fetch weather information';
        console.error('Weather query error:', error);
    }
}

// Get current location and query weather
function fetchWeatherUsingCurrentLocation() {
    const weatherElement = document.getElementById('weather');

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`Location obtained: Latitude ${latitude}, Longitude ${longitude}`);
                getWeatherByLocation(latitude, longitude);
            },
            (error) => {
                console.error('Failed to get location', error);
                weatherElement.textContent = 'Location unavailable, showing Pittsburgh weather';
                // Default city (Pittsburgh)
                getWeatherByLocation(40.4406, -79.9959);
            }
        );
    } else {
        console.error('Browser does not support Geolocation API');
        weatherElement.textContent = 'Geolocation not supported, showing Pittsburgh weather';
        getWeatherByLocation(40.4406, -79.9959);
    }
}

// Add city search button event listener
document.getElementById('city-button').addEventListener('click', () => {
    const cityInput = document.getElementById('city-input');
    const city = cityInput.value.trim();
    if (city) {
        getWeatherByCity(city);
    }
});

// Add Enter key event listener for city input
document.getElementById('city-input').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        const city = event.target.value.trim();
        if (city) {
            getWeatherByCity(city);
        }
    }
});

// Get current weather on page load
fetchWeatherUsingCurrentLocation();

// Call LLM API
async function callLLMAPI(query) {
    const OPENAI_API_KEY = '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';
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
        if (!response.ok) throw new Error('LLM API call failed');
        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error(error);
        return 'Sorry, API request failed. Please try again later.';
    }
}

// Convert text to speech
function speakText(text) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = 'zh-CN';
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
}
document.getElementById('sidebar-toggle').addEventListener('click', function() {
    document.body.classList.toggle('sidebar-closed');
});

// 可以通过按 Esc 键切换侧边栏
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.body.classList.toggle('sidebar-closed');
    }
});
// Bind LLM button click event
const llmButton = document.getElementById('llm-button');

llmButton.addEventListener('click', async () => {
    const query = document.getElementById('llm-input').value;
    const responseElement = document.getElementById('llm-response');
    
    try {
        // Input Validation
        if (!query.trim()) {
            responseElement.textContent = 'Please enter a valid query.';
            return;
        }

        responseElement.textContent = 'Processing...';

        // API Call
        const response = await callLLMAPI(query);

        // Handle API response
        if (!response) {
            throw new Error('Empty response from the server.');
        }

        responseElement.textContent = response;

        // Text-to-speech function
        try {
            speakText(response);
        } catch (speechError) {
            console.error('Text-to-speech failed:', speechError.message);
            responseElement.textContent += '\n(Note: Unable to process text-to-speech.)';
        }

    } catch (error) {
        // General Error Handling
        console.error('Error occurred:', error.message);
        responseElement.textContent = `An error occurred: ${error.message}. Please try again later.`;
    }
});


const openNoteModalButton = document.getElementById('open-note-modal');
const closeNoteModalButton = document.getElementById('close-note-modal');
const noteModal = document.getElementById('note-modal');
const noteDateInput = document.getElementById('note-date');
const noteTextInput = document.getElementById('note-text');
const saveNoteButton = document.getElementById('save-note-button');
const noteListContainer = document.getElementById('note-list');
// 显示弹窗
openNoteModalButton.addEventListener('click', () => {
    noteModal.classList.remove('hidden');
    noteDateInput.value = new Date().toISOString().split('T')[0]; // 默认日期为今天
    noteTextInput.value = ''; // 清空输入框
    renderNotes();
});

// 隐藏弹窗
closeNoteModalButton.addEventListener('click', () => {
    noteModal.classList.add('hidden');
});

// 加载笔记
function loadNotes() {
    return JSON.parse(localStorage.getItem('notes')) || [];
}

// 保存笔记到 localStorage
function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// 渲染笔记列表
function renderNotes() {
    const notes = loadNotes();
    noteListContainer.innerHTML = ''; // 清空旧内容

    notes
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // 按日期降序排序
        .forEach((note) => {
            const noteItem = document.createElement('div');
            noteItem.classList.add('note-item');
            noteItem.innerHTML = `
                <div><strong>Date:</strong> ${note.date}</div>
                <div>${note.text}</div>
            `;
            noteListContainer.appendChild(noteItem);
        });
}

// 添加新笔记
saveNoteButton.addEventListener('click', () => {
    const date = noteDateInput.value;
    const text = noteTextInput.value.trim();

    if (!date || !text) {
        alert('Please provide both date and text.');
        return;
    }

    const notes = loadNotes();
    notes.push({ date, text });
    saveNotes(notes);
    renderNotes();

    // 清空输入框并隐藏弹窗
    noteDateInput.value = '';
    noteTextInput.value = '';
    noteModal.classList.add('hidden');
});

// 初始化笔记功能
renderNotes();