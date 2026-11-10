/**
 * Nihongo Master - Storage Service
 * Quản lý lưu trữ LocalStorage, xuất/nhập tệp JSON sao lưu và khôi phục mặc định
 */

const STORAGE_KEY_PARTS = 'nihongo_master_parts_v3';
const STORAGE_KEY_WORDS = 'nihongo_master_words_v3';

let parts = [];
let words = [];

/**
 * Tải dữ liệu từ LocalStorage hoặc khởi tạo từ dữ liệu mẫu
 */
function loadAppData() {
    try {
        const savedParts = localStorage.getItem(STORAGE_KEY_PARTS);
        const savedWords = localStorage.getItem(STORAGE_KEY_WORDS);

        if (savedParts && savedWords) {
            parts = JSON.parse(savedParts);
            words = JSON.parse(savedWords);
            // Đồng bộ trạng thái isKanji cho dữ liệu đã lưu trước đó nếu chưa có thuộc tính này
            let needsUpdate = false;
            words.forEach(w => {
                if (typeof w.isKanji === 'undefined') {
                    w.isKanji = Boolean((typeof hasKanji === 'function' && hasKanji(w.jp)) || Number(w.part) === 5);
                    needsUpdate = true;
                }
            });
            if (needsUpdate) {
                localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
            }
        } else {
            // Khởi tạo mặc định (5 phần học & 71 từ vựng bao gồm Kanji thời gian/tự nhiên)
            parts = JSON.parse(JSON.stringify(defaultParts));
            words = JSON.parse(JSON.stringify(defaultWords));
            saveAppData();
        }
    } catch (e) {
        console.warn('Lỗi đọc dữ liệu từ localStorage, sử dụng mặc định:', e);
        parts = JSON.parse(JSON.stringify(defaultParts));
        words = JSON.parse(JSON.stringify(defaultWords));
    }
}

/**
 * Lưu trữ trạng thái hiện tại vào LocalStorage và cập nhật các view
 */
function saveAppData() {
    try {
        localStorage.setItem(STORAGE_KEY_PARTS, JSON.stringify(parts));
        localStorage.setItem(STORAGE_KEY_WORDS, JSON.stringify(words));
    } catch (e) {
        console.error('Lỗi ghi dữ liệu vào localStorage:', e);
    }
    refreshAllViews();
}

/**
 * Làm mới toàn bộ giao diện sau khi thay đổi dữ liệu
 */
function refreshAllViews() {
    if (typeof renderVocabHome === 'function') renderVocabHome();
    if (typeof renderDictFilterButtons === 'function') renderDictFilterButtons();
    if (typeof renderDictWords === 'function') renderDictWords();
    if (typeof renderManageView === 'function') renderManageView();
}

/**
 * Lấy danh sách từ vựng theo một hoặc nhiều ID phần học
 * - Nếu partNum là 0 hoặc mảng chứa 0: lấy tất cả từ vựng
 * - Nếu partNum là mảng [1, 2]: lấy các từ thuộc các phần trong mảng
 * - Nếu partNum là số: lấy từ của phần đó
 */
function getWordsByPart(partNum) {
    if (Array.isArray(partNum)) {
        if (partNum.length === 0 || partNum.includes(0)) return words;
        const ids = partNum.map(Number);
        return words.filter(w => ids.includes(Number(w.part)));
    }
    const num = Number(partNum);
    if (num === 0) return words;
    return words.filter(w => Number(w.part) === num);
}

/**
 * Lấy thông tin đối tượng phần học theo ID
 */
function getPartById(partId) {
    return parts.find(p => Number(p.id) === Number(partId)) || { name: `Phần ${partId}`, color: 'blue' };
}

/**
 * Khôi phục về bộ dữ liệu mặc định ban đầu
 */
function resetToDefaultData() {
    if (confirm('Bạn có chắc chắn muốn khôi phục về bộ dữ liệu mặc định ban đầu không? (Gồm 5 phần học & 71 từ vựng bao gồm 28 từ Kanji)\nCác bài học tùy chỉnh bạn đã thêm sẽ được làm mới.')) {
        parts = JSON.parse(JSON.stringify(defaultParts));
        words = JSON.parse(JSON.stringify(defaultWords));
        saveAppData();
        if (typeof showToast === 'function') {
            showToast('Đã khôi phục về bộ 71 từ vựng mặc định thành công!', 'success');
        }
    }
}

/**
 * Xuất dữ liệu người dùng ra file JSON sao lưu
 */
function exportDataJSON() {
    const exportPayload = {
        app: 'NihongoMaster',
        version: '3.0.0',
        exportedAt: new Date().toISOString(),
        parts: parts,
        words: words
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nihongo_master_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    if (typeof showToast === 'function') {
        showToast('Đã xuất file sao lưu dữ liệu thành công!', 'success');
    }
}

/**
 * Nạp dữ liệu từ file JSON vào ứng dụng
 */
function importDataJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.parts && Array.isArray(imported.parts) && imported.words && Array.isArray(imported.words)) {
                if (confirm(`Tìm thấy ${imported.parts.length} phần học và ${imported.words.length} từ vựng trong file sao lưu.\nBạn có muốn nạp dữ liệu này vào ứng dụng không?`)) {
                    parts = imported.parts;
                    words = imported.words;
                    saveAppData();
                    if (typeof showToast === 'function') {
                        showToast(`Nạp thành công ${words.length} từ vựng!`, 'success');
                    }
                }
            } else {
                if (typeof showToast === 'function') {
                    showToast('Định dạng tệp JSON không hợp lệ! Vui lòng chọn đúng tệp sao lưu.', 'error');
                }
            }
        } catch (err) {
            console.error('Lỗi phân tích JSON:', err);
            if (typeof showToast === 'function') {
                showToast('Không thể đọc tệp JSON. Vui lòng kiểm tra lại!', 'error');
            }
        }
        event.target.value = '';
    };
    reader.readAsText(file);
}
