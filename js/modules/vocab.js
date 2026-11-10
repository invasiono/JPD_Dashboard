/**
 * Nihongo Master - Vocabulary Module
 * Quản lý học từ vựng: Trang chủ bài học, Trắc nghiệm (Quiz), Luyện gõ từ (IME) và Tổng kết
 */

let currentVocabMode = 'quiz'; // 'quiz' | 'typing'
let currentPartNum = 1;
let currentSelectedPartIds = [1];
let selectedPartIds = new Set(); // Bộ nhớ các ID phần học được tick chọn
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let hasAnswered = false;
let isQuizQuestionFlipped = false;
let isTypingQuestionFlipped = false;
let vocabTypingModeSetting = 'auto'; // 'auto' | 'toHiragana' | 'toKatakana'

/**
 * Đảm bảo luôn có phần học hợp lệ được chọn mặc định
 */
function initDefaultSelectedParts() {
    const validPartIds = new Set(parts.map(p => Number(p.id)));
    for (const id of Array.from(selectedPartIds)) {
        if (!validPartIds.has(id)) {
            selectedPartIds.delete(id);
        }
    }

    if (selectedPartIds.size === 0 && parts.length > 0) {
        selectedPartIds.add(Number(parts[0].id));
    }
}

/**
 * Bật/tắt trạng thái chọn của một phần học
 */
function togglePartSelection(partId) {
    const num = Number(partId);
    if (selectedPartIds.has(num)) {
        selectedPartIds.delete(num);
    } else {
        selectedPartIds.add(num);
    }
    renderVocabPartsGrid();
    updateSelectedPartsUI();
}

/**
 * Chọn tất cả các phần học hiện có
 */
function selectAllVocabParts() {
    parts.forEach(p => selectedPartIds.add(Number(p.id)));
    renderVocabPartsGrid();
    updateSelectedPartsUI();
    if (typeof showToast === 'function') {
        showToast(`Đã chọn toàn bộ ${parts.length} phần học!`, 'info');
    }
}

/**
 * Bỏ chọn tất cả các phần học
 */
function deselectAllVocabParts() {
    selectedPartIds.clear();
    renderVocabPartsGrid();
    updateSelectedPartsUI();
}

/**
 * Cập nhật giao diện thanh thống kê và nút bắt đầu theo các phần đã chọn
 */
function updateSelectedPartsUI() {
    const summaryBadge = document.getElementById('selected-parts-summary');
    const startBtn = document.getElementById('start-selected-parts-btn');
    const startBtnText = document.getElementById('start-selected-parts-text');

    const selectedList = Array.from(selectedPartIds);
    const selectedWords = getWordsByPart(selectedList);
    const countParts = selectedList.length;

    if (summaryBadge) {
        summaryBadge.innerText = `${countParts} / ${parts.length} phần (${selectedWords.length} từ)`;
        summaryBadge.className = countParts > 0
            ? 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200'
            : 'text-xs font-bold px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200';
    }

    if (startBtn && startBtnText) {
        const modeText = currentVocabMode === 'quiz' ? 'Trắc nghiệm' : 'Luyện gõ';
        if (countParts > 0) {
            startBtn.disabled = false;
            startBtnText.innerText = `🚀 Bắt đầu ${modeText} (${countParts} phần • ${selectedWords.length} từ)`;
        } else {
            startBtn.disabled = true;
            startBtnText.innerText = `⚠️ Hãy chọn ít nhất 1 phần để bắt đầu`;
        }
    }
}

/**
 * Render danh sách thẻ phần học với checkbox và nút học nhanh
 */
function renderVocabPartsGrid() {
    const grid = document.getElementById('vocab-parts-grid');
    if (!grid) return;
    grid.innerHTML = '';

    if (parts.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full p-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <p class="text-gray-500 font-semibold mb-3">Hiện chưa có phần học nào.</p>
                <button onclick="switchMainTab('manage')" class="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm">
                    + Thêm phần học ngay
                </button>
            </div>
        `;
        return;
    }

    parts.forEach(part => {
        const partWords = words.filter(w => Number(w.part) === Number(part.id));
        const theme = partColorThemes[part.color] || partColorThemes.blue;
        const sampleWords = partWords.slice(0, 4).map(w => w.jp).join(', ') + (partWords.length > 4 ? '...' : '');
        const isSelected = selectedPartIds.has(Number(part.id));

        const card = document.createElement('div');
        const activeStyle = isSelected
            ? `ring-2 ring-blue-500 border-blue-400 bg-gradient-to-br ${theme.gradient} shadow-md`
            : `border-gray-200/90 bg-white hover:border-gray-300 hover:shadow-sm`;

        card.className = `p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between group relative ${activeStyle}`;
        card.onclick = () => togglePartSelection(part.id);

        card.innerHTML = `
            <div>
                <div class="flex items-center justify-between gap-2 mb-2">
                    <!-- Checkbox & Tag -->
                    <div class="flex items-center gap-2.5">
                        <div class="w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white shadow-xs' : 'border-gray-300 bg-white group-hover:border-blue-400'}">
                            ${isSelected ? '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>' : ''}
                        </div>
                        <span class="text-xs font-bold ${theme.tagText} uppercase tracking-wide">
                            ${part.name.startsWith('Phần') ? part.name.split(':')[0] : 'Phần ' + part.id} &bull; ${partWords.length} Từ
                        </span>
                    </div>

                    <!-- Nút học riêng 1 phần này nhanh -->
                    <button type="button" onclick="event.stopPropagation(); startVocabSession(${part.id});" class="text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/90 hover:bg-white text-gray-600 hover:text-blue-700 border border-gray-200/80 shadow-xs flex items-center gap-1 transition-all hover:scale-105" title="Luyện tập riêng chỉ phần này">
                        <span>Chỉ phần này</span>
                        <span>&rarr;</span>
                    </button>
                </div>
                <h3 class="text-base sm:text-lg font-bold text-gray-900 mt-1 line-clamp-1 group-hover:text-blue-700 transition-colors">${part.name}</h3>
                <p class="text-xs text-gray-500 mt-1 line-clamp-1">${sampleWords || part.desc || 'Chưa có từ vựng'}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

/**
 * Hiển thị màn hình chọn phần học & cập nhật danh sách các thẻ phần học
 */
function renderVocabHome() {
    initDefaultSelectedParts();

    const badge = document.getElementById('vocab-total-badge');
    if (badge) {
        badge.innerText = `${words.length} Từ vựng • ${parts.length} Phần học`;
    }

    const allWordsBtnText = document.getElementById('all-words-btn-text');
    if (allWordsBtnText) {
        allWordsBtnText.innerText = `🔥 Thử thách toàn bộ ${words.length} từ`;
    }

    renderVocabPartsGrid();
    updateSelectedPartsUI();
}

/**
 * Đổi phương pháp học: Trắc nghiệm vs Luyện gõ từ
 */
function setMode(mode) {
    currentVocabMode = mode;
    const quizBtn = document.getElementById('mode-quiz-btn');
    const typingBtn = document.getElementById('mode-typing-btn');
    
    if (mode === 'quiz') {
        quizBtn.className = 'flex-1 py-3 px-4 rounded-xl bg-white text-blue-700 font-bold shadow-sm transition-all flex items-center justify-center gap-2';
        typingBtn.className = 'flex-1 py-3 px-4 rounded-xl text-gray-600 hover:text-gray-900 font-bold transition-all flex items-center justify-center gap-2';
    } else {
        typingBtn.className = 'flex-1 py-3 px-4 rounded-xl bg-white text-blue-700 font-bold shadow-sm transition-all flex items-center justify-center gap-2';
        quizBtn.className = 'flex-1 py-3 px-4 rounded-xl text-gray-600 hover:text-gray-900 font-bold transition-all flex items-center justify-center gap-2';
    }
    updateSelectedPartsUI();
}

/**
 * Bắt đầu làm bài với các phần học đang được tick chọn
 */
function startSelectedVocabSession() {
    const targetPartIds = Array.from(selectedPartIds);
    if (targetPartIds.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Vui lòng chọn ít nhất 1 phần học để bắt đầu!', 'error');
        } else {
            alert('Vui lòng chọn ít nhất 1 phần học để bắt đầu!');
        }
        return;
    }
    startVocabSession(targetPartIds);
}

/**
 * Bắt đầu phiên học từ vựng (Trắc nghiệm hoặc Gõ từ)
 * Chấp nhận: số ID đơn lẻ (1, 2, 0), hoặc mảng các ID phần học ([1, 3])
 */
function startVocabSession(partArg) {
    let targetPartIds = [];
    if (Array.isArray(partArg)) {
        targetPartIds = partArg.map(Number);
    } else if (typeof partArg !== 'undefined') {
        targetPartIds = [Number(partArg)];
    } else {
        targetPartIds = Array.from(selectedPartIds);
    }

    if (targetPartIds.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Vui lòng chọn ít nhất 1 phần học để bắt đầu!', 'error');
        } else {
            alert('Vui lòng chọn ít nhất 1 phần học để bắt đầu!');
        }
        return;
    }

    currentSelectedPartIds = targetPartIds;
    currentPartNum = targetPartIds.length === 1 ? targetPartIds[0] : targetPartIds;

    const targetWords = getWordsByPart(targetPartIds);

    if (!targetWords || targetWords.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Các phần học đã chọn hiện chưa có từ vựng nào! Bạn hãy thêm từ vựng trước nhé.', 'error');
        } else {
            alert('Các phần học đã chọn hiện chưa có từ vựng nào!');
        }
        return;
    }

    currentQuestions = shuffleArray(targetWords);
    currentQuestionIndex = 0;
    score = 0;

    document.getElementById('vocab-home').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('typing-screen').classList.add('hidden');

    let partTitle = '';
    if (targetPartIds.includes(0)) {
        partTitle = 'Toàn bộ từ vựng';
    } else if (targetPartIds.length === 1) {
        const partObj = getPartById(targetPartIds[0]);
        partTitle = partObj ? partObj.name : `Phần ${targetPartIds[0]}`;
    } else {
        partTitle = `${targetPartIds.length} phần đã chọn (${targetWords.length} từ)`;
    }

    const modeName = currentVocabMode === 'quiz' ? 'Trắc nghiệm' : 'Luyện gõ';
    document.getElementById('header-subtitle').innerText = `Đang học: ${partTitle} (${modeName})`;

    if (currentVocabMode === 'quiz') {
        document.getElementById('quiz-screen').classList.remove('hidden');
        loadQuizQuestion();
    } else {
        document.getElementById('typing-screen').classList.remove('hidden');
        loadTypingQuestion();
    }
}

/**
 * Dừng bài học và quay về danh sách phần học
 */
function quitVocabSession() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('typing-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    document.getElementById('vocab-home').classList.remove('hidden');
    document.getElementById('header-subtitle').innerText = 'Học từ vựng & Luyện gõ tiếng Nhật tức thì';
    renderVocabHome();
}

/**
 * Làm lại bài học hiện tại (giữ nguyên các phần đã chọn)
 */
function retrySession() {
    startVocabSession(currentSelectedPartIds);
}

/* ==========================================================================
   A. CHẾ ĐỘ TRẮC NGHIỆM (QUIZ MODE)
   ========================================================================== */

function updateQuizQuestionDisplay(animate = false) {
    const currentWord = currentQuestions[currentQuestionIndex];
    if (!currentWord) return;

    const labelEl = document.getElementById('quiz-label-text');
    const textEl = document.getElementById('quiz-question-text');
    const subEl = document.getElementById('quiz-sub-text');
    const toggleBtn = document.getElementById('quiz-kanji-toggle-btn');
    const toggleText = document.getElementById('quiz-kanji-toggle-text');
    const cardEl = document.getElementById('quiz-question-card');

    if (currentWord.isKanji) {
        if (toggleBtn) toggleBtn.classList.remove('hidden');
        if (cardEl) {
            cardEl.classList.add('cursor-pointer');
            cardEl.onclick = (e) => {
                if (e.target.closest('#quiz-audio-btn')) return;
                toggleQuizKanjiMeaning(e);
            };
        }

        if (isQuizQuestionFlipped) {
            // Đã bấm lật -> chuyển hiển thị nghĩa tiếng Việt
            if (labelEl) labelEl.innerText = 'Nghĩa tiếng Việt (Đã lật)';
            if (textEl) {
                textEl.innerText = currentWord.vn;
                textEl.className = 'text-3xl sm:text-4xl font-extrabold text-blue-700 mt-2 mb-2 transition-all' + (animate ? ' kanji-flip-anim' : '');
            }
            if (subEl) subEl.innerText = 'Bấm vào để xem lại chữ Hán (Kanji)';
            if (toggleText) toggleText.innerText = `🔄 Bấm xem chữ Kanji (${currentWord.jp})`;
            if (toggleBtn) toggleBtn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-100 hover:bg-blue-200 border border-blue-300 text-blue-800 text-xs font-semibold rounded-full shadow-sm cursor-pointer transition-all hover:scale-105';
        } else {
            // Mặc định cho Kanji: hiện chữ Kanji, KHÔNG hiện nghĩa
            if (labelEl) labelEl.innerText = 'Hán tự (Kanji)';
            if (textEl) {
                textEl.innerText = currentWord.jp;
                textEl.className = 'text-4xl sm:text-5xl font-black text-gray-900 japanese-font mt-2 mb-2 transition-all' + (animate ? ' kanji-flip-anim' : '');
            }
            if (subEl) subEl.innerText = 'Chọn cách đọc tương ứng • Bấm vào để xem nghĩa tiếng Việt';
            if (toggleText) toggleText.innerText = '👁️ Bấm xem nghĩa tiếng Việt';
            if (toggleBtn) toggleBtn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold rounded-full shadow-sm cursor-pointer transition-all hover:scale-105';
        }
    } else {
        // Mặc định như bình thường: hiện nghĩa tiếng Việt
        if (toggleBtn) toggleBtn.classList.add('hidden');
        if (cardEl) {
            cardEl.classList.remove('cursor-pointer');
            cardEl.onclick = null;
        }
        if (labelEl) labelEl.innerText = 'Nghĩa tiếng Việt';
        if (textEl) {
            textEl.innerText = currentWord.vn;
            textEl.className = 'text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-2 transition-all';
        }
        if (subEl) subEl.innerText = 'Chọn từ tiếng Nhật tương ứng chính xác';
    }
}

function toggleQuizKanjiMeaning(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const currentWord = currentQuestions[currentQuestionIndex];
    if (!currentWord || !currentWord.isKanji) return;
    isQuizQuestionFlipped = !isQuizQuestionFlipped;
    updateQuizQuestionDisplay(true);
}

function loadQuizQuestion() {
    hasAnswered = false;
    isQuizQuestionFlipped = false;
    const currentWord = currentQuestions[currentQuestionIndex];
    
    document.getElementById('quiz-question-counter').innerText = `Câu ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('quiz-score-counter').innerText = `Điểm: ${score}`;
    
    const progress = (currentQuestionIndex / currentQuestions.length) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${progress}%`;

    document.getElementById('quiz-audio-btn').classList.add('hidden');
    document.getElementById('next-quiz-btn').classList.add('hidden');

    updateQuizQuestionDisplay();

    // Tạo các phương án trắc nghiệm (1 đúng + các phương án gây nhiễu)
    const candidateDistractors = currentQuestions.filter(w => w.id !== currentWord.id);
    let otherWords = candidateDistractors;
    if (otherWords.length < 3) {
        const extraWords = words.filter(w => w.id !== currentWord.id && !otherWords.some(o => o.id === w.id));
        otherWords = [...otherWords, ...extraWords];
    }
    const numDistractors = Math.min(3, otherWords.length);
    const shuffledOthers = shuffleArray(otherWords).slice(0, numDistractors);
    const options = shuffleArray([currentWord, ...shuffledOthers]);

    const container = document.getElementById('quiz-options-container');
    container.innerHTML = '';

    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.dataset.wordId = opt.id;
        btn.className = 'p-4 rounded-xl text-lg font-bold japanese-font bg-white hover:bg-blue-50 border-2 border-gray-200 text-gray-800 transition-all text-center flex flex-col items-center justify-center gap-0.5 hover:border-blue-300 shadow-sm';
        
        if (currentWord.isKanji) {
            // Khi câu hỏi là Kanji: hiển thị cách đọc Kana để người học chọn đúng cách đọc
            const mainText = opt.reading || opt.jp;
            btn.innerHTML = `<span class="text-xl sm:text-2xl font-bold">${mainText}</span>`;
        } else {
            // Bình thường
            const readingBadge = (opt.reading && opt.reading !== opt.jp) 
                ? `<span class="text-xs font-normal text-gray-500">${opt.reading}</span>` 
                : '';
            btn.innerHTML = `
                <span class="text-xl sm:text-2xl font-bold">${opt.jp}</span>
                ${readingBadge}
            `;
        }
        btn.onclick = () => selectQuizAnswer(opt, btn, currentWord);
        container.appendChild(btn);
    });
}

function selectQuizAnswer(selectedWord, buttonEl, correctWord) {
    if (hasAnswered) return;
    hasAnswered = true;

    const isCorrect = selectedWord.id === correctWord.id;
    const container = document.getElementById('quiz-options-container');
    const buttons = container.querySelectorAll('button');

    buttons.forEach(btn => {
        btn.disabled = true;
        const bId = Number(btn.dataset.wordId);
        if (bId === correctWord.id) {
            btn.className = 'p-4 rounded-xl text-lg font-bold japanese-font bg-emerald-50 border-2 border-emerald-500 text-emerald-700 text-center flex flex-col items-center justify-center gap-0.5 shadow-sm';
            if (correctWord.isKanji) {
                btn.innerHTML = `
                    <span class="text-xl sm:text-2xl font-bold">${correctWord.reading || correctWord.jp}</span>
                    <span class="text-xs font-semibold text-emerald-600">${correctWord.jp} • ${correctWord.vn}</span>
                `;
            }
        }
    });

    if (isCorrect) {
        score++;
        if (typeof playSoundSuccess === 'function') playSoundSuccess();
        buttonEl.className = 'p-4 rounded-xl text-lg font-bold japanese-font bg-emerald-100 border-2 border-emerald-600 text-emerald-800 text-center flex flex-col items-center justify-center gap-0.5 shadow-sm';
        if (correctWord.isKanji) {
            buttonEl.innerHTML = `
                <span class="text-xl sm:text-2xl font-bold">${correctWord.reading || correctWord.jp}</span>
                <span class="text-xs font-semibold text-emerald-700">${correctWord.jp} • ${correctWord.vn}</span>
            `;
        }
    } else {
        if (typeof playSoundError === 'function') playSoundError();
        buttonEl.className = 'p-4 rounded-xl text-lg font-bold japanese-font bg-red-100 border-2 border-red-500 text-red-700 text-center flex flex-col items-center justify-center gap-0.5 shadow-sm line-through';
    }

    document.getElementById('quiz-score-counter').innerText = `Điểm: ${score}`;
    document.getElementById('quiz-audio-btn').classList.remove('hidden');
    document.getElementById('next-quiz-btn').classList.remove('hidden');

    if (typeof speakText === 'function') {
        speakText(correctWord.reading || correctWord.jp);
    }
    document.getElementById('next-quiz-btn').focus();
}

function nextQuizQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadQuizQuestion();
    } else {
        showVocabResult();
    }
}

/* ==========================================================================
   B. CHẾ ĐỘ LUYỆN GÕ TỪ VỰNG (WORD TYPING MODE)
   ========================================================================== */

function setVocabTypingMode(mode) {
    vocabTypingModeSetting = mode;
    
    const autoBtn = document.getElementById('vocab-ime-auto');
    const hiraBtn = document.getElementById('vocab-ime-hira');
    const kataBtn = document.getElementById('vocab-ime-kata');

    [autoBtn, hiraBtn, kataBtn].forEach(b => b.className = 'px-2.5 py-1 text-xs font-bold rounded-lg text-gray-600 hover:text-gray-900 transition-all');

    if (mode === 'auto') autoBtn.className = 'px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-sm transition-all';
    if (mode === 'toHiragana') hiraBtn.className = 'px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-sm transition-all';
    if (mode === 'toKatakana') kataBtn.className = 'px-2.5 py-1 text-xs font-bold rounded-lg bg-white text-blue-700 shadow-sm transition-all';

    applyVocabImeBinding();
}

function applyVocabImeBinding() {
    const inputEl = document.getElementById('typing-input');
    if (!inputEl) return;

    const currentWord = currentQuestions[currentQuestionIndex];
    let targetIme = 'toHiragana';

    if (vocabTypingModeSetting === 'auto') {
        if (currentWord && typeof isKatakanaWord === 'function' && isKatakanaWord(currentWord.jp)) {
            targetIme = 'toKatakana';
        } else {
            targetIme = 'toHiragana';
        }
    } else {
        targetIme = vocabTypingModeSetting;
    }

    if (typeof safeBindWanakana === 'function') {
        safeBindWanakana(inputEl, { IMEMode: targetIme });
    }
}

function updateTypingQuestionDisplay(animate = false) {
    const currentWord = currentQuestions[currentQuestionIndex];
    if (!currentWord) return;

    const labelEl = document.getElementById('typing-label-text');
    const textEl = document.getElementById('typing-question-text');
    const subEl = document.getElementById('typing-sub-text');
    const toggleBtn = document.getElementById('typing-kanji-toggle-btn');
    const toggleText = document.getElementById('typing-kanji-toggle-text');
    const cardEl = document.getElementById('typing-question-card');

    if (currentWord.isKanji) {
        if (toggleBtn) toggleBtn.classList.remove('hidden');
        if (cardEl) {
            cardEl.classList.add('cursor-pointer');
            cardEl.onclick = (e) => {
                if (e.target.closest('#typing-audio-btn')) return;
                toggleTypingKanjiMeaning(e);
            };
        }

        if (isTypingQuestionFlipped) {
            // Đã bấm lật -> chuyển hiển thị nghĩa tiếng Việt
            if (labelEl) labelEl.innerText = 'Nghĩa tiếng Việt (Đã lật)';
            if (textEl) {
                textEl.innerText = currentWord.vn;
                textEl.className = 'text-3xl sm:text-4xl font-extrabold text-indigo-700 mt-2 mb-2 transition-all' + (animate ? ' kanji-flip-anim' : '');
            }
            if (subEl) subEl.innerText = 'Bấm vào để xem lại chữ Hán (Kanji)';
            if (toggleText) toggleText.innerText = `🔄 Bấm xem chữ Kanji (${currentWord.jp})`;
            if (toggleBtn) toggleBtn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-100 hover:bg-indigo-200 border border-indigo-300 text-indigo-800 text-xs font-semibold rounded-full shadow-sm cursor-pointer transition-all hover:scale-105';
        } else {
            // Mặc định cho Kanji: hiện chữ Kanji, KHÔNG hiện nghĩa
            if (labelEl) labelEl.innerText = 'Hán tự (Kanji)';
            if (textEl) {
                textEl.innerText = currentWord.jp;
                textEl.className = 'text-4xl sm:text-5xl font-black text-gray-900 japanese-font mt-2 mb-2 transition-all' + (animate ? ' kanji-flip-anim' : '');
            }
            if (subEl) subEl.innerText = 'Gõ cách đọc Kana/Romaji • Bấm vào để xem nghĩa tiếng Việt';
            if (toggleText) toggleText.innerText = '👁️ Bấm xem nghĩa tiếng Việt';
            if (toggleBtn) toggleBtn.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold rounded-full shadow-sm cursor-pointer transition-all hover:scale-105';
        }
    } else {
        // Mặc định như bình thường: hiện nghĩa tiếng Việt
        if (toggleBtn) toggleBtn.classList.add('hidden');
        if (cardEl) {
            cardEl.classList.remove('cursor-pointer');
            cardEl.onclick = null;
        }
        if (labelEl) labelEl.innerText = 'Nghĩa tiếng Việt';
        if (textEl) {
            textEl.innerText = currentWord.vn;
            textEl.className = 'text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2 mb-2 transition-all';
        }
        if (subEl) subEl.innerText = 'Gõ Romaji, hệ thống tự động đổi sang Hiragana/Katakana trực tiếp';
    }
}

function toggleTypingKanjiMeaning(e) {
    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
    const currentWord = currentQuestions[currentQuestionIndex];
    if (!currentWord || !currentWord.isKanji) return;
    isTypingQuestionFlipped = !isTypingQuestionFlipped;
    updateTypingQuestionDisplay(true);
}

function loadTypingQuestion() {
    hasAnswered = false;
    isTypingQuestionFlipped = false;
    const currentWord = currentQuestions[currentQuestionIndex];

    document.getElementById('typing-question-counter').innerText = `Câu ${currentQuestionIndex + 1}/${currentQuestions.length}`;
    document.getElementById('typing-score-counter').innerText = `Điểm: ${score}`;

    const progress = (currentQuestionIndex / currentQuestions.length) * 100;
    document.getElementById('typing-progress-bar').style.width = `${progress}%`;

    const inputEl = document.getElementById('typing-input');
    inputEl.value = '';
    inputEl.disabled = false;
    inputEl.className = 'w-full py-4 px-6 text-center text-2xl sm:text-3xl font-bold japanese-font border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner';

    document.getElementById('typing-feedback').classList.add('hidden');
    document.getElementById('next-typing-btn').classList.add('hidden');
    document.getElementById('check-typing-btn').classList.remove('hidden');
    document.getElementById('typing-audio-btn').classList.add('hidden');

    document.getElementById('hint-text').classList.add('hidden');
    document.getElementById('hint-text').innerText = `Romaji: ${currentWord.romaji || ''}`;

    updateTypingQuestionDisplay();
    applyVocabImeBinding();
    setTimeout(() => inputEl.focus(), 120);
}

function toggleHint() {
    const hintEl = document.getElementById('hint-text');
    if (hintEl) hintEl.classList.toggle('hidden');
}

function checkTypingAnswer() {
    if (hasAnswered) return;
    const inputEl = document.getElementById('typing-input');
    const userRaw = inputEl.value.trim();
    if (!userRaw) {
        inputEl.focus();
        return;
    }

    const currentWord = currentQuestions[currentQuestionIndex];
    const targetWord = currentWord.jp;
    const targetReading = currentWord.reading || currentWord.jp;

    const normalizedUser = typeof sanitizeString === 'function' ? sanitizeString(userRaw) : userRaw;
    const normalizedTargetJp = typeof sanitizeString === 'function' ? sanitizeString(targetWord) : targetWord;
    const normalizedTargetReading = typeof sanitizeString === 'function' ? sanitizeString(targetReading) : targetReading;

    // Xử lý các từ có nhiều cách đọc phân cách bởi dấu '/' như "なん/なに"
    const readingAlternatives = targetReading.split('/').map(r => typeof sanitizeString === 'function' ? sanitizeString(r.trim()) : r.trim());

    const isMatch = (
        normalizedUser === normalizedTargetJp ||
        normalizedUser === normalizedTargetReading ||
        readingAlternatives.includes(normalizedUser) ||
        userRaw === targetWord ||
        userRaw === targetReading
    );

    hasAnswered = true;
    inputEl.disabled = true;

    const feedbackEl = document.getElementById('typing-feedback');
    feedbackEl.classList.remove('hidden');

    const displayTitle = (currentWord.reading && currentWord.reading !== currentWord.jp)
        ? `${currentWord.jp} (${currentWord.reading})`
        : currentWord.jp;

    if (isMatch) {
        score++;
        if (typeof playSoundSuccess === 'function') playSoundSuccess();
        inputEl.className = 'w-full py-4 px-6 text-center text-2xl sm:text-3xl font-bold japanese-font border-2 border-emerald-500 bg-emerald-50/50 text-emerald-800 rounded-2xl outline-none shadow-inner';
        feedbackEl.className = 'mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-center block';
        feedbackEl.innerHTML = `
            <div class="flex flex-col items-center justify-center gap-0.5 text-lg">
                <div class="flex items-center gap-2">
                    <span>✨ Chính xác!</span>
                    <span class="text-xl font-extrabold japanese-font">${displayTitle}</span>
                </div>
                <div class="text-xs font-semibold text-emerald-700">Nghĩa: ${currentWord.vn}</div>
            </div>
            <div class="text-xs font-normal text-emerald-600 mt-1">Phiên âm: ${currentWord.romaji || ''}</div>
        `;
    } else {
        if (typeof playSoundError === 'function') playSoundError();
        inputEl.className = 'w-full py-4 px-6 text-center text-2xl sm:text-3xl font-bold japanese-font border-2 border-red-500 bg-red-50/50 text-red-800 rounded-2xl outline-none shadow-inner';
        feedbackEl.className = 'mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 font-bold text-center block';
        feedbackEl.innerHTML = `
            <div class="text-sm font-semibold text-red-600 mb-1">Chưa chính xác!</div>
            <div class="text-xl font-extrabold japanese-font text-gray-900">Đáp án: ${displayTitle}</div>
            <div class="text-xs font-semibold text-gray-700 mt-0.5">Nghĩa: ${currentWord.vn}</div>
            <div class="text-xs font-normal text-gray-600 mt-1">Bạn đã nhập: <span class="japanese-font font-bold text-red-700">${userRaw}</span> &bull; Gõ Romaji: <code class="font-bold text-indigo-700">${currentWord.romaji || ''}</code></div>
        `;
    }

    document.getElementById('typing-score-counter').innerText = `Điểm: ${score}`;
    document.getElementById('check-typing-btn').classList.add('hidden');
    document.getElementById('next-typing-btn').classList.remove('hidden');
    document.getElementById('typing-audio-btn').classList.remove('hidden');

    if (typeof speakText === 'function') {
        speakText(currentWord.reading || currentWord.jp);
    }
    document.getElementById('next-typing-btn').focus();
}

function nextTypingQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < currentQuestions.length) {
        loadTypingQuestion();
    } else {
        showVocabResult();
    }
}

/* ==========================================================================
   C. MÀN HÌNH TỔNG KẾT KẾT QUẢ
   ========================================================================== */

function showVocabResult() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('typing-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');

    const total = currentQuestions.length;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;

    document.getElementById('result-score-text').innerText = `${score} / ${total}`;
    document.getElementById('result-percentage-text').innerText = `Tỷ lệ chính xác: ${percent}%`;

    const subtitleEl = document.getElementById('result-subtitle');
    if (subtitleEl) {
        if (currentSelectedPartIds.includes(0)) {
            subtitleEl.innerText = `Bạn đã hoàn thành thử thách toàn bộ ${total} từ vựng!`;
        } else if (currentSelectedPartIds.length > 1) {
            subtitleEl.innerText = `Bạn đã hoàn thành bài luyện tập gồm ${currentSelectedPartIds.length} phần học (${total} từ vựng).`;
        } else {
            subtitleEl.innerText = 'Bạn đã hoàn thành phần học này.';
        }
    }

    const evalEl = document.getElementById('result-evaluation');
    const iconEl = document.getElementById('result-icon-container');

    if (percent === 100) {
        iconEl.innerText = '🏆';
        evalEl.innerText = 'Hoàn hảo tuyệt đối! Bạn là cao thủ tiếng Nhật.';
    } else if (percent >= 80) {
        iconEl.innerText = '🌟';
        evalEl.innerText = 'Rất tuyệt vời! Bạn đã ghi nhớ rất tốt.';
    } else if (percent >= 50) {
        iconEl.innerText = '💪';
        evalEl.innerText = 'Khá tốt! Hãy ôn lại các từ chưa quen để đạt điểm tuyệt đối nhé.';
    } else {
        iconEl.innerText = '📖';
        evalEl.innerText = 'Đừng nản chí! Hãy làm lại phần này để nhớ từ vựng lâu hơn.';
    }

    document.getElementById('header-subtitle').innerText = 'Kết quả bài kiểm tra';
}

// Bắt phím Enter cho ô gõ từ vựng
function bindTypingEnterKey() {
    const inputEl = document.getElementById('typing-input');
    if (!inputEl) return;
    inputEl.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!hasAnswered) {
                checkTypingAnswer();
            } else {
                nextTypingQuestion();
            }
        }
    });
}

