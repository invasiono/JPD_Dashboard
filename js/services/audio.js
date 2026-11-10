/**
 * Nihongo Master - Audio & Speech Service
 * Quản lý phát âm giọng bản xứ (Web Speech API) và hiệu ứng âm thanh (Web Audio API)
 */

let soundEnabled = true;
let audioCtx = null;

/**
 * Khởi tạo hoặc lấy AudioContext an toàn
 */
function getAudioContext() {
    if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
}

/**
 * Phát âm thanh tổng hợp tần số tùy chỉnh
 */
function playTone(freq, type, duration, startTime = 0) {
    if (!soundEnabled) return;
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
    } catch (e) {
        console.warn('Audio play error:', e);
    }
}

/**
 * Âm thanh báo đúng (Success Chime)
 */
function playSoundSuccess() {
    playTone(523.25, 'sine', 0.15, 0);    // C5
    playTone(659.25, 'sine', 0.25, 0.12); // E5
    playTone(783.99, 'sine', 0.35, 0.24); // G5
}

/**
 * Âm thanh báo sai (Error Buzz)
 */
function playSoundError() {
    playTone(220, 'triangle', 0.15, 0);
    playTone(180, 'triangle', 0.25, 0.12);
}

/**
 * Bật/tắt toàn bộ hiệu ứng âm thanh
 */
function toggleSound() {
    soundEnabled = !soundEnabled;
    const iconOn = document.getElementById('sound-icon-on');
    const iconOff = document.getElementById('sound-icon-off');
    if (iconOn) iconOn.classList.toggle('hidden', !soundEnabled);
    if (iconOff) iconOff.classList.toggle('hidden', soundEnabled);
    if (typeof showToast === 'function') {
        showToast(soundEnabled ? 'Đã bật âm thanh' : 'Đã tắt âm thanh');
    }
}

/**
 * Phát âm tiếng Nhật chuẩn bản xứ qua Web Speech API
 */
function speakText(text) {
    if (!text || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    
    // Lọc bỏ các ký tự ngữ pháp hoặc ký hiệu không đọc được
    const cleanText = text.replace(/[~～N]/g, '').trim();
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ja-JP';
    utterance.rate = 0.85; // Tốc độ vừa phải cho người học
    window.speechSynthesis.speak(utterance);
}

/**
 * Phát âm từ vựng hiện tại trong phiên học
 */
function speakCurrentWord(event) {
    if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
    }
    if (typeof currentQuestions !== 'undefined' && currentQuestions[currentQuestionIndex]) {
        const word = currentQuestions[currentQuestionIndex];
        // Ưu tiên đọc theo Kana reading để phát âm chuẩn các từ Kanji đa âm đọc
        speakText(word.reading || word.jp);
    }
}

