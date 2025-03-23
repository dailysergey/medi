// YouTube API
let player;
const lofiPlaylists = {
    meditation: [
        'jfKfPfyJRdk', // Lofi Girl
        'DWcJFNfaw9c', // Chillhop
        '5qap5aO4i9A', // Lofi hip hop
        'kgx4WGK0oNU'  // Relaxing Lofi
    ],
    work: [
        'p3ynjjRbU9A' // Work with me video
    ],
    night: [
        'WhZ7eikzJvk' // Night Time video
    ]
};

let currentMode = 'meditation';
let currentVideoIndex = 0;

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
        videoId: lofiPlaylists[currentMode][currentVideoIndex],
        playerVars: {
            'autoplay': 0,
            'controls': 0,
            'rel': 0,
            'showinfo': 0,
            'modestbranding': 1,
            'loop': 1,
            'start': currentMode === 'work' ? 5452 : 0 // Начало видео для режима работы
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
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
        nextVideo();
    });
    
    // Настройка кнопок режимов
    document.getElementById('mode-meditation').addEventListener('click', () => {
        switchMode('meditation');
    });
    
    document.getElementById('mode-work').addEventListener('click', () => {
        switchMode('work');
    });
    
    document.getElementById('mode-night').addEventListener('click', () => {
        switchMode('night');
    });
    
    // Добавляем обработчики для кнопок перемотки
    document.getElementById('forward-btn').addEventListener('click', () => {
        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + 10, true);
    });
    
    document.getElementById('backward-btn').addEventListener('click', () => {
        const currentTime = player.getCurrentTime();
        player.seekTo(Math.max(0, currentTime - 10), true);
    });
    
    // Обработка прогресс-бара
    const progressBar = document.getElementById('progress-bar');
    progressBar.addEventListener('input', () => {
        const seekToTime = player.getDuration() * (progressBar.value / 100);
        player.seekTo(seekToTime, true);
    });
    
    // Начинаем обновлять прогресс
    updateVideoProgress();
}

// Переключение на следующее видео в плейлисте
function nextVideo() {
    const playlist = lofiPlaylists[currentMode];
    currentVideoIndex = (currentVideoIndex + 1) % playlist.length;
    const startTime = currentMode === 'work' ? 5452 : 0;
    player.loadVideoById({
        videoId: playlist[currentVideoIndex],
        startSeconds: startTime
    });
}

// Переключение режима
function switchMode(mode) {
    if (mode === currentMode) return;
    
    // Обновляем текущий режим
    currentMode = mode;
    currentVideoIndex = 0;
    
    // Обновляем classList для body
    document.body.classList.remove('mode-meditation', 'mode-work', 'mode-night');
    document.body.classList.add(`mode-${mode}`);
    
    // Обновляем активную кнопку
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`mode-${mode}`).classList.add('active');
    
    // Загружаем видео из нового плейлиста
    const startTime = mode === 'work' ? 5452 : 0;
    player.loadVideoById({
        videoId: lofiPlaylists[mode][0],
        startSeconds: startTime
    });
    
    // Обновляем стили и контент в зависимости от режима
    updateContentForMode(mode);
}

// Обновление контента для разных режимов
function updateContentForMode(mode) {
    const subtitles = {
        meditation: 'Расслабьтесь и сконцентрируйтесь с помощью успокаивающей музыки',
        work: 'Работайте продуктивно с приятной атмосферой',
        night: 'Время для спокойного отдыха и погружения в сон'
    };
    
    document.querySelector('.subtitle').textContent = subtitles[mode];
    
    // Обновляем заголовок таймера
    const timerTitles = {
        meditation: 'Таймер медитации',
        work: 'Таймер продуктивности',
        night: 'Таймер сна'
    };
    
    document.querySelector('.timer-container h2').textContent = timerTitles[mode];
    
    // Создаем новые листочки с учетом текущего режима
    recreateLeaves();
}

// Пересоздание падающих листьев
function recreateLeaves() {
    // Удаляем существующие
    document.querySelectorAll('.floating-leaf').forEach(leaf => {
        leaf.remove();
    });
    
    // Создаем новые
    createLeaves();
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
            
            const modeMessages = {
                meditation: 'Время медитации истекло',
                work: 'Время работы истекло. Пора сделать перерыв!',
                night: 'Пора спать. Спокойной ночи!'
            };
            
            alert(modeMessages[currentMode]);
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Цитаты для разных режимов
const quotes = {
    meditation: [
        "Дыхание — это нить, которая связывает нас с настоящим моментом.",
        "Медитация — это не бегство от реальности, а встреча с ней.",
        "В тишине находятся ответы на все вопросы.",
        "Вдох. Выдох. Это основа жизни и основа покоя.",
        "Спокойствие ума приносит внутреннюю силу и уверенность.",
        "Настоящая медитация — это стать настолько тихим, чтобы ничто не беспокоило ваш внутренний покой."
    ],
    work: [
        "Сосредоточенность — это ключ к продуктивности.",
        "Маленькие шаги каждый день приводят к большим результатам.",
        "Работа в правильной атмосфере удваивает эффективность.",
        "Найди свой ритм и следуй ему.",
        "Концентрация и спокойствие — лучшие союзники в работе.",
        "Делай то, что любишь, и ты никогда не будешь работать ни дня в своей жизни."
    ],
    night: [
        "Сон — это лучшая медитация.",
        "Ночь дает нам возможность начать все заново.",
        "В тишине ночи мы находим себя.",
        "Спокойный ум приводит к спокойному сну.",
        "Сон — это время, когда мозг упорядочивает дневные впечатления.",
        "Хороший сон — основа здоровой и счастливой жизни."
    ]
};

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
            alert('Пожалуйста, выберите время');
        }
    });
    
    document.getElementById('stop-timer').addEventListener('click', () => {
        clearInterval(timerInterval);
        player.pauseVideo();
    });
    
    // Случайная цитата в зависимости от режима
    function setRandomQuote() {
        const quoteElement = document.getElementById('quote');
        const modeQuotes = quotes[currentMode];
        const randomIndex = Math.floor(Math.random() * modeQuotes.length);
        quoteElement.textContent = `"${modeQuotes[randomIndex]}"`;
    }
    
    setRandomQuote();
    setInterval(setRandomQuote, 30000); // Меняет цитату каждые 30 секунд
    
    // По умолчанию активируем режим медитации
    document.getElementById('mode-meditation').classList.add('active');
});

// Определяем глобальную функцию для YouTube API
window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

// Добавьте обработку состояния плеера
function onPlayerStateChange(event) {
    // Статус 1 означает, что видео воспроизводится
    if (event.data === 1) {
        // Обновляем интерфейс для активного воспроизведения
        document.getElementById('play-btn').classList.add('active');
        document.getElementById('pause-btn').classList.remove('active');
    } else if (event.data === 2) { // Статус 2 означает паузу
        // Обновляем интерфейс для паузы
        document.getElementById('play-btn').classList.remove('active');
        document.getElementById('pause-btn').classList.add('active');
    }
}

// Добавьте новую функцию для обновления прогресс-бара и времени
function updateVideoProgress() {
    const intervalId = setInterval(() => {
        if (!player || typeof player.getCurrentTime !== 'function') return;
        
        const currentTime = player.getCurrentTime() || 0;
        const duration = player.getDuration() || 0;
        
        if (duration > 0) {
            // Обновляем положение прогресс-бара
            const progressPercent = (currentTime / duration) * 100;
            document.getElementById('progress-bar').value = progressPercent;
            
            // Обновляем отображение времени
            document.getElementById('current-time').textContent = formatTime(currentTime);
            document.getElementById('duration').textContent = formatTime(duration);
        }
    }, 1000);
    
    // Сохраняем ID интервала для возможной очистки
    window.videoProgressInterval = intervalId;
}

// Функция форматирования времени из секунд в MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
} 