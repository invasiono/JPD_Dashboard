/**
 * Nihongo Master - Dictionary & Kana Charts Module
 * Quản lý sổ tay tra cứu từ vựng và bảng chữ cái Hiragana/Katakana 50 âm Gojūon
 */

let dictFilterPart = 0;

/**
 * Chuyển đổi giữa 3 danh mục con: Từ vựng, Bảng Hiragana, Bảng Katakana
 */
function switchDictSubTab(subTab) {
    const vocabBtn = document.getElementById('dict-tab-vocab-btn');
    const hiraBtn = document.getElementById('dict-tab-hira-btn');
    const kataBtn = document.getElementById('dict-tab-kata-btn');

    const vocabView = document.getElementById('dict-vocab-view');
    const hiraView = document.getElementById('dict-hiragana-view');
    const kataView = document.getElementById('dict-katakana-view');

    [vocabBtn, hiraBtn, kataBtn].forEach(b => {
        if (b) b.className = 'px-3.5 py-2 rounded-lg text-gray-600 hover:text-gray-900 transition-all';
    });
    [vocabView, hiraView, kataView].forEach(v => {
        if (v) v.classList.add('hidden');
    });

    if (subTab === 'vocab') {
        if (vocabBtn) vocabBtn.className = 'px-3.5 py-2 rounded-lg bg-white text-blue-700 shadow-sm transition-all';
        if (vocabView) vocabView.classList.remove('hidden');
        renderDictWords();
    } else if (subTab === 'hiragana') {
        if (hiraBtn) hiraBtn.className = 'px-3.5 py-2 rounded-lg bg-white text-blue-700 shadow-sm transition-all';
        if (hiraView) hiraView.classList.remove('hidden');
    } else if (subTab === 'katakana') {
        if (kataBtn) kataBtn.className = 'px-3.5 py-2 rounded-lg bg-white text-blue-700 shadow-sm transition-all';
        if (kataView) kataView.classList.remove('hidden');
    }
}

/**
 * Render thanh nút bấm lọc theo phần học
 */
function renderDictFilterButtons() {
    const container = document.getElementById('dict-filter-container');
    if (!container) return;
    container.innerHTML = `<span class="text-xs font-semibold text-gray-500">Lọc phần:</span>`;

    // Nút Tất cả
    const allBtn = document.createElement('button');
    allBtn.className = dictFilterPart === 0
        ? 'dict-filter-btn px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700'
        : 'dict-filter-btn px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200';
    allBtn.innerText = `Tất cả (${words.length})`;
    allBtn.onclick = () => filterDictByPart(0);
    container.appendChild(allBtn);

    parts.forEach(part => {
        const count = words.filter(w => Number(w.part) === Number(part.id)).length;
        const btn = document.createElement('button');
        btn.className = dictFilterPart === part.id
            ? 'dict-filter-btn px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700'
            : 'dict-filter-btn px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 hover:bg-gray-200';
        btn.innerText = `${part.name.startsWith('Phần') ? part.name.split(':')[0] : 'Phần ' + part.id} (${count})`;
        btn.onclick = () => filterDictByPart(part.id);
        container.appendChild(btn);
    });
}

function filterDictByPart(partId) {
    dictFilterPart = Number(partId);
    renderDictFilterButtons();
    renderDictWords();
}

/**
 * Render danh sách từ vựng dạng thẻ flashcard
 */
function renderDictWords() {
    const container = document.getElementById('dict-words-grid');
    if (!container) return;
    container.innerHTML = '';

    const list = dictFilterPart === 0 ? words : words.filter(w => Number(w.part) === dictFilterPart);

    if (list.length === 0) {
        container.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-400">
                <p class="text-sm font-semibold">Chưa có từ vựng nào trong mục này.</p>
            </div>
        `;
        return;
    }

    list.forEach(w => {
        const speakTextVal = (w.reading || w.jp).replace(/'/g, "\\'");
        const card = document.createElement('div');
        card.className = 'p-3.5 bg-gray-50 hover:bg-blue-50/60 border border-gray-200 hover:border-blue-300 rounded-xl transition-all flex items-center justify-between cursor-pointer group shadow-sm';
        card.onclick = () => {
            if (typeof speakText === 'function') speakText(w.reading || w.jp);
        };

        const readingBadge = (w.reading && w.reading !== w.jp)
            ? `<span class="px-2 py-0.5 text-xs font-bold bg-blue-100 text-blue-700 rounded-md font-sans">${w.reading}</span>`
            : '';

        const kanjiBadge = w.isKanji
            ? `<span class="px-1.5 py-0.2 text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60 rounded">Kanji</span>`
            : '';

        card.innerHTML = `
            <div>
                <div class="flex items-center flex-wrap gap-1.5">
                    <span class="text-xs font-bold text-gray-400">#${w.id}</span>
                    <span class="text-lg font-bold japanese-font text-gray-900 group-hover:text-blue-600 transition-colors">${w.jp}</span>
                    ${kanjiBadge}
                    ${readingBadge}
                </div>
                <div class="text-xs text-gray-500 font-mono mt-0.5">${w.romaji || ''}</div>
                <div class="text-sm font-semibold text-gray-700 mt-1">${w.vn}</div>
            </div>
            <button onclick="event.stopPropagation(); if (typeof speakText === 'function') speakText('${speakTextVal}');" class="w-8 h-8 rounded-lg bg-white group-hover:bg-blue-600 text-gray-500 group-hover:text-white flex items-center justify-center transition-all shadow-sm" title="Phát âm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
            </button>
        `;
        container.appendChild(card);
    });
}

/**
 * Render bảng 50 âm cơ bản Hiragana & Katakana
 */
function renderKanaCharts() {
    const hiraContainer = document.getElementById('hiragana-chart-container');
    const kataContainer = document.getElementById('katakana-chart-container');
    if (!hiraContainer || !kataContainer || typeof kanaAlphabet === 'undefined') return;
    hiraContainer.innerHTML = '';
    kataContainer.innerHTML = '';

    kanaAlphabet.forEach(k => {
        if (!k.h) {
            const empty1 = document.createElement('div');
            empty1.className = 'p-3 bg-gray-50 rounded-xl opacity-30';
            hiraContainer.appendChild(empty1);

            const empty2 = document.createElement('div');
            empty2.className = 'p-3 bg-gray-50 rounded-xl opacity-30';
            kataContainer.appendChild(empty2);
            return;
        }

        // Hiragana Card
        const cardH = document.createElement('button');
        cardH.className = 'p-3 bg-indigo-50/50 hover:bg-indigo-100 border border-indigo-200/80 rounded-xl text-center transition-all hover:scale-105';
        cardH.onclick = () => {
            if (typeof speakText === 'function') speakText(k.h);
        };
        cardH.innerHTML = `
            <div class="text-2xl font-bold japanese-font text-indigo-900">${k.h}</div>
            <div class="text-xs text-indigo-600 font-mono mt-1">${k.r}</div>
        `;
        hiraContainer.appendChild(cardH);

        // Katakana Card
        const cardK = document.createElement('button');
        cardK.className = 'p-3 bg-purple-50/50 hover:bg-purple-100 border border-purple-200/80 rounded-xl text-center transition-all hover:scale-105';
        cardK.onclick = () => {
            if (typeof speakText === 'function') speakText(k.k);
        };
        cardK.innerHTML = `
            <div class="text-2xl font-bold japanese-font text-purple-900">${k.k}</div>
            <div class="text-xs text-purple-600 font-mono mt-1">${k.r}</div>
        `;
        kataContainer.appendChild(cardK);
    });
}
