/**
 * Nihongo Master - Main Application Core & Router
 * Điều phối tổng thể: SPA routing, tiện ích chuỗi, toast thông báo và khởi chạy ứng dụng
 */

let currentMainTab = 'vocab'; // 'vocab' | 'typing' | 'dict' | 'manage'

/* ==========================================================================
   1. TOAST THÔNG BÁO TIỆN ÍCH (TOAST NOTIFICATIONS)
   ========================================================================== */

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const bgClass = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-gray-900';
    toast.className = `${bgClass} text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 pointer-events-auto`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✓' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
        <span>${message}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

/* ==========================================================================
   2. TIỆN ÍCH HỖ TRỢ CHUỖI & WANAKANA
   ========================================================================== */

/**
 * Gắn kết thư viện WanaKana IME vào phần tử input/textarea một cách an toàn
 */
function safeBindWanakana(element, options) {
    if (typeof wanakana === 'undefined' || !element) return;
    try {
        if (element.hasAttribute('data-wanakana-id')) {
            wanakana.unbind(element);
        }
    } catch (err) {}
    try {
        wanakana.bind(element, options);
    } catch (err) {
        console.warn('Wanakana bind notice:', err);
    }
}

/**
 * Xáo trộn ngẫu nhiên mảng (Fisher-Yates Shuffle)
 */
function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/**
 * Chuẩn hóa chuỗi so sánh: Hiragana hóa, loại bỏ khoảng trắng, dấu ~ và chữ N trong mẫu ngữ pháp
 */
function sanitizeString(str) {
    if (!str) return '';
    let converted = str;
    if (typeof wanakana !== 'undefined') {
        converted = wanakana.toHiragana(str);
    }
    return converted.replace(/[\s～~NnＮｎ\-_]/g, '').toLowerCase();
}

/**
 * Kiểm tra xem một từ chủ yếu là Katakana hay không
 */
function isKatakanaWord(text) {
    if (typeof wanakana !== 'undefined') {
        return wanakana.isKatakana(text.replace(/[\s～~Nnー\-]/g, ''));
    }
    return /[\u30A0-\u30FF]/.test(text);
}

/**
 * Kiểm tra xem một chuỗi có chứa ký tự Hán tự (Kanji) hay không
 */
function hasKanji(text) {
    if (!text) return false;
    return /[\u4e00-\u9faf\u3400-\u4dbf\uf900-\ufaff]/.test(text);
}

/* ==========================================================================
   3. ĐIỀU HƯỚNG TAB CHÍNH (SPA ROUTING)
   ========================================================================== */

function switchMainTab(tab) {
    currentMainTab = tab;
    
    // Ẩn tất cả section
    const sections = ['tab-vocab', 'tab-typing', 'tab-dict', 'tab-manage'];
    sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    });

    // Reset style các nút điều hướng
    const navButtons = [
        { id: 'nav-vocab-btn', tab: 'vocab' },
        { id: 'nav-typing-btn', tab: 'typing' },
        { id: 'nav-dict-btn', tab: 'dict' },
        { id: 'nav-manage-btn', tab: 'manage' }
    ];

    const inactiveClass = 'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-900 transition-all flex items-center gap-1.5 whitespace-nowrap';
    const activeClass = 'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 bg-white text-blue-600 shadow-sm whitespace-nowrap';

    navButtons.forEach(item => {
        const btn = document.getElementById(item.id);
        if (btn) btn.className = (item.tab === tab) ? activeClass : inactiveClass;
    });

    const activeSection = document.getElementById(`tab-${tab}`);
    if (activeSection) activeSection.classList.remove('hidden');

    const subtitleEl = document.getElementById('header-subtitle');

    if (tab === 'vocab') {
        if (subtitleEl) subtitleEl.innerText = 'Học từ vựng & Luyện gõ tiếng Nhật tức thì';
        if (typeof renderVocabHome === 'function') renderVocabHome();
    } else if (tab === 'typing') {
        if (subtitleEl) subtitleEl.innerText = 'Luyện gõ Romaji chuyển đổi tức thì sang Kana';
        if (typeof initFreeTypingPlayground === 'function') initFreeTypingPlayground();
        if (typeof initSpeedDrill === 'function') initSpeedDrill();
    } else if (tab === 'dict') {
        if (subtitleEl) subtitleEl.innerText = 'Bảng tra cứu Kana & Từ vựng có phát âm';
        if (typeof renderDictFilterButtons === 'function') renderDictFilterButtons();
        if (typeof renderDictWords === 'function') renderDictWords();
        if (typeof renderKanaCharts === 'function') renderKanaCharts();
    } else if (tab === 'manage') {
        if (subtitleEl) subtitleEl.innerText = 'Tùy chỉnh & Quản lý bài học, từ vựng theo ý muốn';
        if (typeof renderManageView === 'function') renderManageView();
    }
}

/* ==========================================================================
   4. KHỞI TẠO ỨNG DỤNG LẦN ĐẦU (BOOTSTRAP)
   ========================================================================== */

window.addEventListener('DOMContentLoaded', () => {
    // 1. Tải dữ liệu lưu trữ
    if (typeof loadAppData === 'function') {
        loadAppData();
    }

    // 2. Render các thành phần mặc định
    if (typeof renderVocabHome === 'function') {
        renderVocabHome();
    }
    if (typeof renderDictFilterButtons === 'function') {
        renderDictFilterButtons();
    }
    if (typeof renderDictWords === 'function') {
        renderDictWords();
    }

    // 3. Gắn sự kiện phím Enter
    if (typeof bindTypingEnterKey === 'function') {
        bindTypingEnterKey();
    }

    // 4. Kiểm tra WanaKana
    if (typeof wanakana === 'undefined') {
        console.warn('WanaKana library is loading or unavailable.');
    }
});

