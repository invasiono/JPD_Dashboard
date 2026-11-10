/**
 * Nihongo Master - Lesson Customizer & Bulk Import Module
 * Quản lý tùy chỉnh bài học & từ vựng:
 * - CRUD Modals cho Phần học & Từ vựng đơn lẻ
 * - Dán & Nhập từ vựng hàng loạt (Bulk Paste Import) với định dạng 3 dòng tự động
 */

// Danh sách mẫu 28 từ vựng Kanji người dùng cung cấp (sẵn sàng dán thử nghiệm 1 chạm)
const SAMPLE_KANJI_TEXT = `月
つき
mặt trăng

一月
いちがつ
tháng 1

十二月
じゅうにがつ
Tháng 12

月曜日
げつようび
Thứ 2

花火
はなび
pháo hoa

火
ひ
lửa

火曜日
かようび
Thứ 3

水
みず
nước

水曜日
すいようび
Thứ 4

木
き
Cây / gỗ

木曜日
もくようび
Thứ 5

お金
おかね
tiền

金曜日
きんようび
Thứ 6

土
つち
Đất

土曜日
どようび
Thứ 7

何
なん/なに
Cái gì

何月
なんがつ
tháng mấy

何人
なんにん
Mấy người

何曜日
なんようび
Thứ mấy

何年
なんねん
Năm bao nhiêu

今年
ことし
Năm nay

九時
くじ
9 giờ

何時
なんじ
Mấy giờ

時間
じかん
Thời gian

何時間
なんじかん
Mấy tiếng

分かります
わかります
Hiểu

半分
はんぶん
Một nửa

六分
ろっぷん
6 phút`;

/**
 * Hiển thị toàn bộ giao diện quản lý (Thống kê, Danh sách phần, Bảng từ vựng)
 */
function renderManageView() {
    // Cập nhật thống kê
    const statParts = document.getElementById('manage-stat-parts');
    const statWords = document.getElementById('manage-stat-words');
    if (statParts) statParts.innerText = parts.length;
    if (statWords) statWords.innerText = words.length;

    // Cập nhật danh sách Parts
    const partsListContainer = document.getElementById('manage-parts-list');
    if (partsListContainer) {
        partsListContainer.innerHTML = '';
        if (parts.length === 0) {
            partsListContainer.innerHTML = `
                <div class="col-span-full py-6 text-center text-gray-400 text-sm">
                    Chưa có phần học nào. Nhấp "+ Thêm Phần" để tạo phần đầu tiên.
                </div>
            `;
        } else {
            parts.forEach(part => {
                const count = words.filter(w => Number(w.part) === Number(part.id)).length;
                const theme = partColorThemes[part.color] || partColorThemes.blue;

                const card = document.createElement('div');
                card.className = `p-4 bg-gradient-to-br ${theme.gradient} border ${theme.border} rounded-2xl flex flex-col justify-between transition-all shadow-sm`;
                card.innerHTML = `
                    <div>
                        <div class="flex items-center justify-between mb-1">
                            <span class="text-xs font-bold uppercase tracking-wider ${theme.tagText}">
                                Mã ID: ${part.id} &bull; ${count} Từ vựng
                            </span>
                            <div class="flex items-center gap-1">
                                <button onclick="openPartModal(${part.id})" class="p-1.5 hover:bg-white/80 rounded-lg text-gray-600 hover:text-blue-600 transition-colors" title="Chỉnh sửa phần này">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                </button>
                                <button onclick="deletePart(${part.id})" class="p-1.5 hover:bg-white/80 rounded-lg text-gray-600 hover:text-red-600 transition-colors" title="Xóa phần này">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                                </button>
                            </div>
                        </div>
                        <h4 class="font-bold text-gray-900 text-base leading-snug">${part.name}</h4>
                        <p class="text-xs text-gray-500 mt-1 line-clamp-2">${part.desc || 'Không có mô tả'}</p>
                    </div>
                    <div class="mt-4 pt-3 border-t border-gray-200/50 flex items-center justify-between text-xs font-semibold">
                        <button onclick="startVocabSession(${part.id})" class="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                            <span>Học phần này</span>
                            <span>&rarr;</span>
                        </button>
                        <button onclick="filterManageByPart(${part.id})" class="text-gray-500 hover:text-gray-900">
                            Xem các từ (${count})
                        </button>
                    </div>
                `;
                partsListContainer.appendChild(card);
            });
        }
    }

    // Cập nhật dropdown filter ở bảng từ vựng
    const filterPartSelect = document.getElementById('manage-filter-part');
    if (filterPartSelect) {
        const currentVal = filterPartSelect.value;
        filterPartSelect.innerHTML = `<option value="0">Tất cả các phần (${words.length} từ)</option>`;
        parts.forEach(part => {
            const count = words.filter(w => Number(w.part) === Number(part.id)).length;
            const opt = document.createElement('option');
            opt.value = part.id;
            opt.innerText = `${part.name} (${count} từ)`;
            filterPartSelect.appendChild(opt);
        });
        if (currentVal) filterPartSelect.value = currentVal;
    }

    renderManageWordsTable();
}

function filterManageByPart(partId) {
    const filterSelect = document.getElementById('manage-filter-part');
    if (filterSelect) {
        filterSelect.value = partId;
        renderManageWordsTable();
        filterSelect.scrollIntoView({ behavior: 'smooth' });
    }
}

function renderManageWordsTable() {
    const searchInput = document.getElementById('manage-search-input');
    const filterPart = document.getElementById('manage-filter-part');
    const tbody = document.getElementById('manage-words-table-body');
    const countInfo = document.getElementById('manage-words-count-info');

    if (!tbody) return;

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const selectedPart = filterPart ? Number(filterPart.value) : 0;

    let filtered = words;

    if (selectedPart !== 0) {
        filtered = filtered.filter(w => Number(w.part) === selectedPart);
    }

    if (query) {
        filtered = filtered.filter(w => 
            w.jp.toLowerCase().includes(query) ||
            (w.reading && w.reading.toLowerCase().includes(query)) ||
            (w.romaji && w.romaji.toLowerCase().includes(query)) ||
            w.vn.toLowerCase().includes(query)
        );
    }

    tbody.innerHTML = '';

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="px-4 py-8 text-center text-gray-400">
                    Không tìm thấy từ vựng nào phù hợp.
                </td>
            </tr>
        `;
    } else {
        filtered.forEach(w => {
            const partObj = getPartById(w.part);
            const theme = partColorThemes[partObj.color] || partColorThemes.blue;
            const speakTarget = (w.reading || w.jp).replace(/'/g, "\\'");

            const tr = document.createElement('tr');
            tr.className = 'hover:bg-blue-50/40 transition-colors';

            const readingTag = (w.reading && w.reading !== w.jp)
                ? `<span class="block text-xs font-semibold text-blue-600 japanese-font">${w.reading}</span>`
                : '';

            const kanjiBadge = w.isKanji
                ? `<span class="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 ml-1.5 align-middle border border-amber-300/60" title="Từ này được đánh dấu là chữ Hán (Kanji)">Kanji</span>`
                : '';

            tr.innerHTML = `
                <td class="px-4 py-3 font-mono text-xs text-gray-400">#${w.id}</td>
                <td class="px-4 py-3">
                    <div class="flex items-center flex-wrap gap-1">
                        <span class="font-bold japanese-font text-base text-gray-900 cursor-pointer hover:text-blue-600" onclick="speakText('${speakTarget}')" title="Bấm để nghe phát âm">
                            ${w.jp}
                        </span>
                        ${kanjiBadge}
                    </div>
                    ${readingTag}
                </td>
                <td class="px-4 py-3 font-mono text-xs text-gray-600">${w.romaji || '—'}</td>
                <td class="px-4 py-3 font-semibold text-gray-800">${w.vn}</td>
                <td class="px-4 py-3">
                    <span class="text-xs px-2.5 py-0.5 rounded-full font-bold ${theme.badgeBg}">
                        ${partObj.name.startsWith('Phần') ? partObj.name.split(':')[0] : 'Phần ' + partObj.id}
                    </span>
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-1">
                        <button onclick="speakText('${speakTarget}')" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors" title="Phát âm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
                        </button>
                        <button onclick="openWordModal(${w.id})" class="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition-colors" title="Chỉnh sửa từ">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button onclick="deleteWord(${w.id})" class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Xóa từ">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    if (countInfo) {
        countInfo.innerText = `Hiển thị ${filtered.length} / ${words.length} từ vựng`;
    }
}

/* ==========================================================================
   A. MODAL & THAO TÁC TỪ VỰNG ĐƠN LẺ
   ========================================================================== */

function populateWordFormParts(selectedPartId) {
    const selectEl = document.getElementById('word-form-part');
    if (!selectEl) return;
    selectEl.innerHTML = '';

    if (parts.length === 0) {
        const opt = document.createElement('option');
        opt.value = 1;
        opt.innerText = 'Phần 1: Mặc định';
        selectEl.appendChild(opt);
        return;
    }

    parts.forEach(part => {
        const opt = document.createElement('option');
        opt.value = part.id;
        opt.innerText = part.name;
        if (Number(part.id) === Number(selectedPartId)) {
            opt.selected = true;
        }
        selectEl.appendChild(opt);
    });
}

function handleWordJpInput(val) {
    const idInput = document.getElementById('word-form-id');
    const readingInput = document.getElementById('word-form-reading');
    const romajiInput = document.getElementById('word-form-romaji');
    const isKanjiInput = document.getElementById('word-form-is-kanji');

    // Nếu đang thêm từ mới (chưa có id) và người dùng gõ có chứa Kanji, tự động bật gợi ý switch Kanji
    if (isKanjiInput && (!idInput || !idInput.value)) {
        if (typeof hasKanji === 'function' && hasKanji(val)) {
            isKanjiInput.checked = true;
        }
    }

    if (romajiInput && typeof wanakana !== 'undefined' && val) {
        const source = (readingInput && readingInput.value.trim()) ? readingInput.value.trim() : val;
        romajiInput.value = wanakana.toRomaji(source);
    }
}

function handleWordReadingInput(val) {
    const romajiInput = document.getElementById('word-form-romaji');
    if (romajiInput && typeof wanakana !== 'undefined' && val) {
        romajiInput.value = wanakana.toRomaji(val);
    }
}

function openWordModal(wordId = null) {
    if (parts.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Bạn hãy tạo ít nhất một Phần học trước khi thêm từ vựng nhé!', 'error');
        }
        openPartModal();
        return;
    }

    const modal = document.getElementById('modal-word');
    const title = document.getElementById('modal-word-title');
    const idInput = document.getElementById('word-form-id');
    const jpInput = document.getElementById('word-form-jp');
    const readingInput = document.getElementById('word-form-reading');
    const romajiInput = document.getElementById('word-form-romaji');
    const vnInput = document.getElementById('word-form-vn');
    const isKanjiInput = document.getElementById('word-form-is-kanji');

    if (wordId) {
        const word = words.find(w => w.id === Number(wordId));
        if (!word) return;
        if (title) title.innerText = `Chỉnh Sửa Từ Vựng #${word.id}`;
        if (idInput) idInput.value = word.id;
        if (jpInput) jpInput.value = word.jp;
        if (readingInput) readingInput.value = word.reading || word.jp || '';
        if (romajiInput) romajiInput.value = word.romaji || '';
        if (vnInput) vnInput.value = word.vn;
        if (isKanjiInput) isKanjiInput.checked = Boolean(word.isKanji);
        populateWordFormParts(word.part);
    } else {
        if (title) title.innerText = 'Thêm Từ Vựng Mới';
        if (idInput) idInput.value = '';
        if (jpInput) jpInput.value = '';
        if (readingInput) readingInput.value = '';
        if (romajiInput) romajiInput.value = '';
        if (vnInput) vnInput.value = '';
        if (isKanjiInput) isKanjiInput.checked = false;
        const currentFilter = document.getElementById('manage-filter-part');
        const defaultPart = currentFilter && Number(currentFilter.value) !== 0 ? Number(currentFilter.value) : parts[0].id;
        populateWordFormParts(defaultPart);
    }

    if (modal) modal.classList.remove('hidden');
    if (jpInput) setTimeout(() => jpInput.focus(), 100);
}

function closeWordModal() {
    const modal = document.getElementById('modal-word');
    if (modal) modal.classList.add('hidden');
}

function saveWordForm(e) {
    e.preventDefault();
    const idInput = document.getElementById('word-form-id');
    const partInput = document.getElementById('word-form-part');
    const jpInput = document.getElementById('word-form-jp');
    const readingInput = document.getElementById('word-form-reading');
    const romajiInput = document.getElementById('word-form-romaji');
    const vnInput = document.getElementById('word-form-vn');
    const isKanjiInput = document.getElementById('word-form-is-kanji');

    const jp = jpInput ? jpInput.value.trim() : '';
    const reading = (readingInput && readingInput.value.trim()) ? readingInput.value.trim() : jp;
    const vn = vnInput ? vnInput.value.trim() : '';
    const part = partInput ? Number(partInput.value) : 1;
    let romaji = romajiInput ? romajiInput.value.trim() : '';
    const isKanji = isKanjiInput ? Boolean(isKanjiInput.checked) : false;

    if (!jp || !vn) {
        if (typeof showToast === 'function') {
            showToast('Vui lòng nhập đầy đủ tiếng Nhật và nghĩa tiếng Việt!', 'error');
        }
        return;
    }

    if (!romaji && typeof wanakana !== 'undefined') {
        romaji = wanakana.toRomaji(reading || jp);
    }

    const idVal = idInput ? idInput.value : '';
    if (idVal) {
        // Sửa từ hiện có
        const word = words.find(w => w.id === Number(idVal));
        if (word) {
            word.jp = jp;
            word.reading = reading;
            word.vn = vn;
            word.romaji = romaji;
            word.part = part;
            word.isKanji = isKanji;
            if (typeof showToast === 'function') {
                showToast(`Đã cập nhật từ vựng "${jp}"`, 'success');
            }
        }
    } else {
        // Thêm từ mới
        const nextId = words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 1;
        words.push({
            id: nextId,
            jp: jp,
            reading: reading,
            vn: vn,
            part: part,
            romaji: romaji,
            isKanji: isKanji
        });
        if (typeof showToast === 'function') {
            showToast(`Đã thêm từ vựng mới "${jp}"`, 'success');
        }
    }

    saveAppData();
    closeWordModal();
}

function deleteWord(wordId) {
    const word = words.find(w => w.id === Number(wordId));
    if (!word) return;

    if (confirm(`Bạn có chắc chắn muốn xóa từ "${word.jp}" (${word.vn}) không?`)) {
        words = words.filter(w => w.id !== Number(wordId));
        saveAppData();
        if (typeof showToast === 'function') {
            showToast(`Đã xóa từ vựng "${word.jp}"`, 'info');
        }
    }
}

/* ==========================================================================
   B. DÁN & NHẬP TỪ VỰNG HÀNG LOẠT (BULK PASTE IMPORT)
   ========================================================================== */

/**
 * Mở modal Dán & Nhập Hàng Loạt
 */
function openBulkModal() {
    if (parts.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Bạn hãy tạo ít nhất một Phần học trước khi nhập từ vựng!', 'error');
        }
        openPartModal();
        return;
    }

    const modal = document.getElementById('modal-bulk');
    const partSelect = document.getElementById('bulk-import-part');
    const currentFilter = document.getElementById('manage-filter-part');
    const defaultPart = currentFilter && Number(currentFilter.value) !== 0 ? Number(currentFilter.value) : parts[0].id;

    if (partSelect) {
        partSelect.innerHTML = '';
        parts.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = p.name;
            if (Number(p.id) === Number(defaultPart)) {
                opt.selected = true;
            }
            partSelect.appendChild(opt);
        });
    }

    previewBulkText();
    if (modal) modal.classList.remove('hidden');

    const textarea = document.getElementById('bulk-import-textarea');
    if (textarea) setTimeout(() => textarea.focus(), 100);
}

/**
 * Đóng modal Dán & Nhập Hàng Loạt
 */
function closeBulkModal() {
    const modal = document.getElementById('modal-bulk');
    if (modal) modal.classList.add('hidden');
}

/**
 * Tạo nhanh một phần học mới trực tiếp từ trong Bulk Modal mà không làm mất văn bản đã dán
 */
function promptCreatePartForBulk() {
    const nextNum = parts.length > 0 ? Math.max(...parts.map(p => p.id)) + 1 : 1;
    const name = prompt('Nhập tên phần học mới:', `Phần ${nextNum}: Từ vựng mới`);
    if (!name || !name.trim()) return;

    const colors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'indigo'];
    const newPart = {
        id: nextNum,
        name: name.trim(),
        desc: 'Tạo từ danh sách nhập hàng loạt',
        color: colors[(nextNum - 1) % colors.length]
    };

    parts.push(newPart);
    saveAppData();

    // Cập nhật lại dropdown trong Bulk Modal và chọn ngay phần mới này
    const partSelect = document.getElementById('bulk-import-part');
    if (partSelect) {
        partSelect.innerHTML = '';
        parts.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.id;
            opt.innerText = p.name;
            if (Number(p.id) === Number(newPart.id)) {
                opt.selected = true;
            }
            partSelect.appendChild(opt);
        });
    }

    if (typeof showToast === 'function') {
        showToast(`Đã tạo phần học "${newPart.name}"!`, 'success');
    }
}

/**
 * Điền tự động 28 từ vựng Kanji mẫu của người dùng vào ô dán để kiểm tra tức thì
 */
function pasteSampleKanjiList() {
    const textarea = document.getElementById('bulk-import-textarea');
    if (textarea) {
        textarea.value = SAMPLE_KANJI_TEXT;
        previewBulkText();
        if (typeof showToast === 'function') {
            showToast('Đã dán 28 từ vựng Kanji mẫu!', 'info');
        }
    }
}

/**
 * Xóa trắng nội dung trong ô dán
 */
function clearBulkText() {
    const textarea = document.getElementById('bulk-import-textarea');
    if (textarea) {
        textarea.value = '';
        previewBulkText();
    }
}

/**
 * Phân tích cú pháp văn bản tiếng Nhật dán vào (Hỗ trợ cấu trúc 3 dòng chuẩn)
 * Dòng 1: Tiếng Nhật (Kanji hoặc Kana)
 * Dòng 2: Cách đọc Kana (furigana / hiragana / katakana)
 * Dòng 3: Nghĩa tiếng Việt
 */
function parseBulkJapaneseText(rawText) {
    if (!rawText || !rawText.trim()) return [];

    // Cách 1: Chia theo các block phân cách bởi 1 hoặc nhiều dòng trống
    const rawBlocks = rawText.split(/\n\s*\n+/).map(b => b.trim()).filter(Boolean);
    const parsedWords = [];

    if (rawBlocks.length > 1) {
        for (const block of rawBlocks) {
            const lines = block.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length >= 2) {
                const jp = lines[0];
                const reading = lines.length >= 3 ? lines[1] : lines[0];
                const vn = lines.length >= 3 ? lines.slice(2).join(', ') : lines[1];

                let romaji = '';
                if (typeof wanakana !== 'undefined') {
                    if (reading.includes('/')) {
                        romaji = reading.split('/').map(p => wanakana.toRomaji(p.trim())).join(' / ');
                    } else {
                        romaji = wanakana.toRomaji(reading);
                    }
                }

                const isKanji = typeof hasKanji === 'function' ? hasKanji(jp) : false;
                parsedWords.push({ jp, reading, vn, romaji, isKanji });
            }
        }
    }

    // Cách 2: Nếu không có dòng trống ngăn cách, duyệt tuần tự từng bộ 3 dòng liên tiếp
    if (parsedWords.length === 0) {
        const allLines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
        for (let i = 0; i < allLines.length; i += 3) {
            if (i + 1 < allLines.length) {
                const jp = allLines[i];
                const reading = (i + 2 < allLines.length) ? allLines[i + 1] : allLines[i];
                const vn = (i + 2 < allLines.length) ? allLines[i + 2] : allLines[i + 1];

                let romaji = '';
                if (typeof wanakana !== 'undefined') {
                    if (reading.includes('/')) {
                        romaji = reading.split('/').map(p => wanakana.toRomaji(p.trim())).join(' / ');
                    } else {
                        romaji = wanakana.toRomaji(reading);
                    }
                }

                const isKanji = typeof hasKanji === 'function' ? hasKanji(jp) : false;
                parsedWords.push({ jp, reading, vn, romaji, isKanji });
            }
        }
    }

    return parsedWords;
}

/**
 * Cập nhật bảng xem trước (Live Preview) theo thời gian thực khi người dùng gõ hoặc dán
 */
function previewBulkText() {
    const textarea = document.getElementById('bulk-import-textarea');
    const tbody = document.getElementById('bulk-preview-tbody');
    const badge = document.getElementById('bulk-preview-badge');
    const confirmBtn = document.getElementById('bulk-confirm-btn');

    if (!tbody) return;

    const raw = textarea ? textarea.value : '';
    const parsed = parseBulkJapaneseText(raw);

    if (badge) {
        badge.innerText = `${parsed.length} từ`;
        badge.className = parsed.length > 0
            ? 'px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-bold'
            : 'px-2 py-0.5 bg-gray-200 text-gray-700 rounded-full text-[11px] font-bold';
    }

    if (confirmBtn) {
        confirmBtn.disabled = parsed.length === 0;
        confirmBtn.innerHTML = parsed.length === 0
            ? `<span>✅ Thêm Vào Danh Sách</span>`
            : `<span>✅ Thêm ${parsed.length} Từ Vào Danh Sách</span>`;
    }

    tbody.innerHTML = '';

    if (parsed.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-3 py-6 text-center text-gray-400">
                    Hãy dán danh sách từ vào ô trên để xem trước tại đây.
                </td>
            </tr>
        `;
        return;
    }

    parsed.forEach((item, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-emerald-50/40 transition-colors';
        const kanjiBadge = item.isKanji
            ? `<span class="ml-1.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300/60 align-middle">Kanji</span>`
            : '';
        tr.innerHTML = `
            <td class="px-3 py-2 font-mono text-[11px] text-gray-400">#${idx + 1}</td>
            <td class="px-3 py-2 font-bold japanese-font text-gray-900">${item.jp} ${kanjiBadge}</td>
            <td class="px-3 py-2 font-semibold text-blue-600 japanese-font">${item.reading}</td>
            <td class="px-3 py-2 font-mono text-gray-500">${item.romaji || '—'}</td>
            <td class="px-3 py-2 font-medium text-gray-700">${item.vn}</td>
        `;
        tbody.appendChild(tr);
    });
}

/**
 * Thực thi nạp hàng loạt từ đã phân tích vào cơ sở dữ liệu
 */
function executeBulkImport() {
    const textarea = document.getElementById('bulk-import-textarea');
    const partSelect = document.getElementById('bulk-import-part');

    const raw = textarea ? textarea.value : '';
    const parsed = parseBulkJapaneseText(raw);

    if (parsed.length === 0) {
        if (typeof showToast === 'function') {
            showToast('Chưa có từ vựng nào hợp lệ để thêm. Vui lòng kiểm tra lại văn bản dán vào!', 'error');
        }
        return;
    }

    const targetPartId = partSelect ? Number(partSelect.value) : (parts[0] ? parts[0].id : 1);
    const targetPart = getPartById(targetPartId);

    let nextId = words.length > 0 ? Math.max(...words.map(w => w.id)) + 1 : 1;

    parsed.forEach(item => {
        words.push({
            id: nextId++,
            jp: item.jp,
            reading: item.reading,
            vn: item.vn,
            romaji: item.romaji,
            part: targetPartId,
            isKanji: Boolean(item.isKanji)
        });
    });

    saveAppData();
    closeBulkModal();
    if (textarea) textarea.value = '';

    // Lọc bảng quản lý về đúng phần vừa nạp để người dùng thấy ngay thành quả
    filterManageByPart(targetPartId);

    if (typeof showToast === 'function') {
        showToast(`Đã thêm thành công ${parsed.length} từ vựng vào "${targetPart.name}"!`, 'success');
    }
}

/* ==========================================================================
   C. MODAL & THAO TÁC PHẦN HỌC (PART CRUD)
   ========================================================================== */

function openPartModal(partId = null) {
    const modal = document.getElementById('modal-part');
    const title = document.getElementById('modal-part-title');
    const idInput = document.getElementById('part-form-id');
    const nameInput = document.getElementById('part-form-name');
    const descInput = document.getElementById('part-form-desc');
    const colorInput = document.getElementById('part-form-color');

    if (partId) {
        const part = parts.find(p => p.id === Number(partId));
        if (!part) return;
        if (title) title.innerText = `Chỉnh Sửa Phần Học #${part.id}`;
        if (idInput) idInput.value = part.id;
        if (nameInput) nameInput.value = part.name;
        if (descInput) descInput.value = part.desc || '';
        if (colorInput) colorInput.value = part.color || 'blue';
    } else {
        if (title) title.innerText = 'Thêm Phần Học Mới';
        if (idInput) idInput.value = '';
        const nextNum = parts.length > 0 ? Math.max(...parts.map(p => p.id)) + 1 : 1;
        if (nameInput) nameInput.value = `Phần ${nextNum}: `;
        if (descInput) descInput.value = '';
        const colors = ['blue', 'emerald', 'amber', 'purple', 'rose', 'indigo'];
        if (colorInput) colorInput.value = colors[(nextNum - 1) % colors.length];
    }

    if (modal) modal.classList.remove('hidden');
    if (nameInput) setTimeout(() => nameInput.focus(), 100);
}

function closePartModal() {
    const modal = document.getElementById('modal-part');
    if (modal) modal.classList.add('hidden');
}

function savePartForm(e) {
    e.preventDefault();
    const idInput = document.getElementById('part-form-id');
    const nameInput = document.getElementById('part-form-name');
    const descInput = document.getElementById('part-form-desc');
    const colorInput = document.getElementById('part-form-color');

    const name = nameInput ? nameInput.value.trim() : '';
    const desc = descInput ? descInput.value.trim() : '';
    const color = colorInput ? colorInput.value : 'blue';

    if (!name) {
        if (typeof showToast === 'function') {
            showToast('Vui lòng nhập tên phần học!', 'error');
        }
        return;
    }

    const idVal = idInput ? idInput.value : '';
    if (idVal) {
        // Sửa phần hiện có
        const part = parts.find(p => p.id === Number(idVal));
        if (part) {
            part.name = name;
            part.desc = desc;
            part.color = color;
            if (typeof showToast === 'function') {
                showToast(`Đã cập nhật phần học "${name}"`, 'success');
            }
        }
    } else {
        // Thêm phần mới
        const nextId = parts.length > 0 ? Math.max(...parts.map(p => p.id)) + 1 : 1;
        parts.push({
            id: nextId,
            name: name,
            desc: desc,
            color: color
        });
        if (typeof showToast === 'function') {
            showToast(`Đã tạo phần học mới "${name}"`, 'success');
        }
    }

    saveAppData();
    closePartModal();
}

function deletePart(partId) {
    const numId = Number(partId);
    const part = parts.find(p => p.id === numId);
    if (!part) return;

    const associatedWords = words.filter(w => Number(w.part) === numId);
    const count = associatedWords.length;

    const msg = count > 0 
        ? `Phần "${part.name}" hiện đang có ${count} từ vựng.\nBạn có chắc chắn muốn xóa phần này cùng toàn bộ ${count} từ vựng thuộc về nó không?`
        : `Bạn có chắc chắn muốn xóa phần "${part.name}" không?`;

    if (confirm(msg)) {
        parts = parts.filter(p => p.id !== numId);
        words = words.filter(w => Number(w.part) !== numId);
        saveAppData();
        if (typeof showToast === 'function') {
            showToast(`Đã xóa phần học "${part.name}"`, 'info');
        }
    }
}
