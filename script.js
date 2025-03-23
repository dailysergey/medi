// YouTube API
let player;
const lofiPlaylists = [
    'jfKfPfyJRdk', // Lofi Girl
    'DWcJFNfaw9c', // Chillhop
    '5qap5aO4i9A', // Lofi hip hop
    'kgx4WGK0oNU'  // Relaxing Lofi
];

// Загрузка YouTube API
function loadYouTubeAPI() {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

// Инициализация YouTube плеера
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '100%',
        width: '100%',
        videoId: lofiPlaylists[0],
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

// Готовность плеера
function onPlayerReady(event) {
    // Плеер готов
    document.getElementById('play-btn').addEventListener('click', () => {
        player.playVideo();
    });
    
    document.getElementById('pause-btn').addEventListener('click', () => {
        player.pauseVideo();
    });
    
    document.getElementById('next-btn').addEventListener('click', () => {
        const currentIndex = lofiPlaylists.indexOf(player.getVideoData().video_id);
        const nextIndex = (currentIndex + 1) % lofiPlaylists.length;
        player.loadVideoById(lofiPlaylists[nextIndex]);
    });
}

// Таймер медитации
let timerInterval;
let remainingTime = 0;

function startTimer(duration) {
    clearInterval(timerInterval);
    remainingTime = duration * 60; // Конвертация в секунды
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            player.pauseVideo();
            alert('Время медитации истекло');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Цитаты для медитации
const quotes = [
    "Дыхание — это нить, которая связывает нас с настоящим моментом.",
    "Медитация — это не бегство от реальности, а встреча с ней.",
    "В тишине находятся ответы на все вопросы.",
    "Вдох. Выдох. Это основа жизни и основа покоя.",
    "Спокойствие ума приносит внутреннюю силу и уверенность.",
    "Настоящая медитация — это стать настолько тихим, чтобы ничто не беспокоило ваш внутренний покой."
];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeAPI();
    
    // Настройка таймера
    document.querySelectorAll('.timer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const time = parseInt(btn.dataset.time);
            document.getElementById('timer-display').textContent = `${time.toString().padStart(2, '0')}:00`;
            remainingTime = time * 60;
        });
    });
    
    document.getElementById('start-timer').addEventListener('click', () => {
        if (remainingTime > 0) {
            startTimer(remainingTime / 60);
            player.playVideo();
        } else {
            alert('Пожалуйста, выберите время медитации');
        }
    });
    
    document.getElementById('stop-timer').addEventListener('click', () => {
        clearInterval(timerInterval);
        player.pauseVideo();
    });
    
    // Случайная цитата
    function setRandomQuote() {
        const quoteElement = document.getElementById('quote');
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteElement.textContent = `"${quotes[randomIndex]}"`;
    }
    
    setRandomQuote();
    setInterval(setRandomQuote, 30000); // Меняет цитату каждые 30 секунд
});

// Определяем глобальную функцию для YouTube API
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady; 