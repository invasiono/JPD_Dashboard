/**
 * Nihongo Master - Kana Typing & Speed Drill Module
 * Quản lý khung gõ Kana tự do (Playground) và thử thách phản xạ gõ Kana nhanh (Speed Drill)
 */

let freeKanaMode = 'toHiragana'; // 'toHiragana' | 'toKatakana'
let drillType = 'hiragana';       // 'hiragana' | 'katakana'
let drillCurrentTarget = null;
let drillStreak = 0;
let drillCompleted = 0;

/* ==========================================================================
   A. KHUNG GÕ TỰ DO (INTERACTIVE PLAYGROUND)
   ========================================================================== */

function setKanaInputMode(mode) {
    freeKanaMode = mode;
    const hiraBtn = document.getElementById('btn-kana-hiragana');
    const kataBtn = document.getElementById('btn-kana-katakana');
    const badge = document.getElementById('active-kana-badge');
    const textarea = document.getElementById('free-kana-input');

    if (mode === 'toHiragana') {
        if (hiraBtn) hiraBtn.className = 'flex-1 py-3 px-4 rounded-xl bg-white text-indigo-600 font-bold shadow-md transition-all flex items-center justify-center gap-2';
        if (kataBtn) kataBtn.className = 'flex-1 py-3 px-4 rounded-xl text-gray-600 hover:text-gray-900 font-bold transition-all flex items-center justify-center gap-2';
        if (badge) {
            badge.innerText = 'Đang gõ: Hiragana (あ)';
            badge.className = 'text-xs font-bold px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-lg';
        }
    } else {
        if (kataBtn) kataBtn.className = 'flex-1 py-3 px-4 rounded-xl bg-white text-indigo-600 font-bold shadow-md transition-all flex items-center justify-center gap-2';
        if (hiraBtn) hiraBtn.className = 'flex-1 py-3 px-4 rounded-xl text-gray-600 hover:text-gray-900 font-bold transition-all flex items-center justify-center gap-2';
        if (badge) {
            badge.innerText = 'Đang gõ: Katakana (ア)';
            badge.className = 'text-xs font-bold px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg';
        }
    }

    if (textarea && textarea.value && typeof wanakana !== 'undefined') {
        if (mode === 'toHiragana') {
            textarea.value = wanakana.toHiragana(textarea.value);
        } else {
            textarea.value = wanakana.toKatakana(textarea.value);
        }
        const previewEl = document.getElementById('free-romaji-preview');
        if (previewEl) previewEl.innerText = wanakana.toRomaji(textarea.value);
    }

    if (typeof safeBindWanakana === 'function') {
        safeBindWanakana(textarea, { IMEMode: freeKanaMode });
    }
    if (textarea) textarea.focus();
}

function initFreeTypingPlayground() {
    const textarea = document.getElementById('free-kana-input');
    if (!textarea) return;

    if (typeof safeBindWanakana === 'function') {
        safeBindWanakana(textarea, { IMEMode: freeKanaMode });
    }

    textarea.addEventListener('input', function() {
        const val = this.value;
        const previewEl = document.getElementById('free-romaji-preview');
        if (val && typeof wanakana !== 'undefined') {
            if (previewEl) previewEl.innerText = wanakana.toRomaji(val);
        } else {
            if (previewEl) previewEl.innerText = '...';
        }
    });

    setTimeout(() => textarea.focus(), 150);
}

function clearFreeInput() {
    const textarea = document.getElementById('free-kana-input');
    if (!textarea) return;
    textarea.value = '';
    const previewEl = document.getElementById('free-romaji-preview');
    if (previewEl) previewEl.innerText = '...';
    textarea.focus();
}

function copyFreeText() {
    const textarea = document.getElementById('free-kana-input');
    if (!textarea || !textarea.value) return;
    navigator.clipboard.writeText(textarea.value).then(() => {
        const btnText = document.getElementById('copy-btn-text');
        if (btnText) {
            btnText.innerText = 'Đã sao chép!';
            setTimeout(() => btnText.innerText = 'Sao chép', 1500);
        }
        if (typeof showToast === 'function') {
            showToast('Đã sao chép văn bản tiếng Nhật vào bộ nhớ tạm!', 'success');
        }
    });
}

/* ==========================================================================
   B. THỬ THÁCH PHẢN XẠ KANA (SPEED DRILL)
   ========================================================================== */

function setDrillMode(type) {
    drillType = type;
    const hiraBtn = document.getElementById('drill-mode-hira');
    const kataBtn = document.getElementById('drill-mode-kata');
    if (type === 'hiragana') {
        if (hiraBtn) hiraBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-700 shadow-sm transition-all';
        if (kataBtn) kataBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all';
    } else {
        if (kataBtn) kataBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-purple-100 text-purple-700 shadow-sm transition-all';
        if (hiraBtn) hiraBtn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all';
    }
    const inputEl = document.getElementById('drill-input');
    if (typeof safeBindWanakana === 'function') {
        safeBindWanakana(inputEl, { IMEMode: type === 'hiragana' ? 'toHiragana' : 'toKatakana' });
    }
    nextDrillTarget();
}

function initSpeedDrill() {
    const inputEl = document.getElementById('drill-input');
    if (!inputEl) return;

    if (typeof safeBindWanakana === 'function') {
        safeBindWanakana(inputEl, { IMEMode: drillType === 'hiragana' ? 'toHiragana' : 'toKatakana' });
    }
    nextDrillTarget();

    inputEl.oninput = function() {
        const userVal = this.value.trim();
        if (!drillCurrentTarget) return;

        const targetKana = drillType === 'hiragana' ? drillCurrentTarget.h : drillCurrentTarget.k;
        const targetRomaji = drillCurrentTarget.r;

        if (userVal === targetKana || userVal.toLowerCase() === targetRomaji) {
            if (typeof playSoundSuccess === 'function') playSoundSuccess();
            drillStreak++;
            drillCompleted++;
            
            const streakEl = document.getElementById('drill-streak');
            const countEl = document.getElementById('drill-count');
            if (streakEl) streakEl.innerText = `${drillStreak} 🔥`;
            if (countEl) countEl.innerText = drillCompleted;

            const feedback = document.getElementById('drill-feedback');
            if (feedback) {
                feedback.innerText = `Chính xác! (${targetKana} = ${targetRomaji})`;
                feedback.className = 'mt-2 text-sm font-bold text-emerald-600 h-6';
            }

            this.value = '';
            setTimeout(nextDrillTarget, 300);
        }
    };
}

function nextDrillTarget() {
    if (typeof kanaAlphabet === 'undefined') return;
    const validLetters = kanaAlphabet.filter(k => k.h !== '');
    const rand = validLetters[Math.floor(Math.random() * validLetters.length)];
    drillCurrentTarget = rand;

    const displayChar = drillType === 'hiragana' ? rand.h : rand.k;
    const targetEl = document.getElementById('drill-target-display');
    const hintEl = document.getElementById('drill-hint-romaji');
    if (targetEl) targetEl.innerText = displayChar;
    if (hintEl) hintEl.innerHTML = `Gõ Romaji: <span class="text-indigo-700 font-bold bg-gray-100 px-2 py-0.5 rounded">${rand.r}</span>`;
    
    const inputEl = document.getElementById('drill-input');
    if (inputEl) {
        inputEl.value = '';
        inputEl.focus();
    }
}

function resetDrill() {
    drillStreak = 0;
    drillCompleted = 0;
    const streakEl = document.getElementById('drill-streak');
    const countEl = document.getElementById('drill-count');
    const feedback = document.getElementById('drill-feedback');
    if (streakEl) streakEl.innerText = '0 🔥';
    if (countEl) countEl.innerText = '0';
    if (feedback) feedback.innerText = '';
    nextDrillTarget();
}

