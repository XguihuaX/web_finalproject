document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('background-video'); // 获取视频
    const muteToggle = document.getElementById('mute-toggle'); // 获取音符按钮
    const soundIcon = muteToggle.querySelector('i'); // 图标元素

    // 默认静音
    video.muted = true;

    // 点击切换静音/开声音状态
    muteToggle.addEventListener('click', () => {
        const isMuted = video.muted;
        video.muted = !isMuted;
        soundIcon.className = isMuted ? 'fas fa-volume-mute' : 'fas fa-volume-up'; // 切换图标
    });
});

function toggleMute() {
    const video = document.querySelector('.background-video');
    const icon = document.querySelector('.mute-button .fas');
    if (video.muted) {
        video.muted = false;
        icon.classList.remove('fa-volume-mute');
        icon.classList.add('fa-volume-up');
    } else {
        video.muted = true;
        icon.classList.remove('fa-volume-up');
        icon.classList.add('fa-volume-mute');
    }
}
