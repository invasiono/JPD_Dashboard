/**
 * Nihongo Master - Default Data & Configuration
 * Chứa bộ dữ liệu gốc: Phần học, Từ vựng, Bảng 46 âm Kana và Bảng màu sắc
 */

// Các Phần học mặc định ban đầu
const defaultParts = [
    { id: 1, name: 'Phần 1: Đồ ăn & Thức uống cơ bản', desc: 'さかな, にく, やさい, カレー...', color: 'blue' },
    { id: 2, name: 'Phần 2: Món ăn & Đồ uống Katakana', desc: 'ごはん, コーヒー, ビール, ワイン...', color: 'emerald' },
    { id: 3, name: 'Phần 3: Quốc gia & Giao tiếp nhà hàng', desc: 'ドイツ, フランス, おねがいします...', color: 'amber' },
    { id: 4, name: 'Phần 4: Số đếm đồ vật thuần Nhật', desc: 'ふたつ, みっつ, よっつ... とお', color: 'purple' },
    { id: 5, name: 'Phần 5: Kanji N5 - Thời gian & Tự nhiên', desc: '月, 一月, 火, 水, 木, 金, 土...', color: 'rose' }
];

// Từ vựng mặc định ban đầu (43 từ vựng cơ bản + 28 từ vựng Kanji thời gian & ngày tháng)
const defaultWords = [
    // Phần 1: Đồ ăn & Thức uống cơ bản
    { id: 1, jp: 'さかな', reading: 'さかな', vn: 'Cá', part: 1, romaji: 'sakana' },
    { id: 2, jp: 'にく', reading: 'にく', vn: 'Thịt', part: 1, romaji: 'niku' },
    { id: 3, jp: 'ぎゅうにく', reading: 'ぎゅうにく', vn: 'Thịt bò', part: 1, romaji: 'gyuuniku' },
    { id: 4, jp: 'とりにく', reading: 'とりにく', vn: 'Thịt gà', part: 1, romaji: 'toriniku' },
    { id: 5, jp: 'ぶたにく', reading: 'ぶたにく', vn: 'Thịt heo', part: 1, romaji: 'butaniku' },
    { id: 6, jp: 'やさい', reading: 'やさい', vn: 'Rau', part: 1, romaji: 'yasai' },
    { id: 7, jp: 'イチゴ', reading: 'イチゴ', vn: 'Dâu tây', part: 1, romaji: 'ichigo' },
    { id: 8, jp: 'リンゴ', reading: 'リンゴ', vn: 'Táo', part: 1, romaji: 'ringo' },
    { id: 9, jp: 'りょうり', reading: 'りょうり', vn: 'Nấu ăn / món ăn', part: 1, romaji: 'ryouri' },
    { id: 10, jp: 'カレー', reading: 'カレー', vn: 'Cà ri', part: 1, romaji: 'karee' },
    { id: 11, jp: 'スープ', reading: 'スープ', vn: 'Súp', part: 1, romaji: 'suupu' },

    // Phần 2: Món ăn & Đồ uống Katakana
    { id: 12, jp: 'とんかつ', reading: 'とんかつ', vn: 'Thịt heo chiên xù', part: 2, romaji: 'tonkatsu' },
    { id: 13, jp: 'ハンバーグ', reading: 'ハンバーグ', vn: 'Hamburger steak', part: 2, romaji: 'hanbaagu' },
    { id: 14, jp: 'ごはん', reading: 'ごはん', vn: 'Cơm', part: 2, romaji: 'gohan' },
    { id: 15, jp: 'ライス', reading: 'ライス', vn: 'Cơm', part: 2, romaji: 'raisu' },
    { id: 16, jp: 'ジュース', reading: 'ジュース', vn: 'Nước ép', part: 2, romaji: 'juusu' },
    { id: 17, jp: 'コーヒー', reading: 'コーヒー', vn: 'Cà phê', part: 2, romaji: 'koohii' },
    { id: 18, jp: 'こうちゃ', reading: 'こうちゃ', vn: 'Trà đen', part: 2, romaji: 'koucha' },
    { id: 19, jp: 'おちゃ', reading: 'おちゃ', vn: 'Trà', part: 2, romaji: 'ocha' },
    { id: 20, jp: 'ビール', reading: 'ビール', vn: 'Bia', part: 2, romaji: 'biiru' },
    { id: 21, jp: 'ワイン', reading: 'ワイン', vn: 'Rượu vang', part: 2, romaji: 'wain' },
    { id: 22, jp: 'インド', reading: 'インド', vn: 'Ấn Độ', part: 2, romaji: 'indo' },

    // Phần 3: Quốc gia & Giao tiếp nhà hàng
    { id: 23, jp: 'ドイツ', reading: 'ドイツ', vn: 'Đức', part: 3, romaji: 'doitsu' },
    { id: 24, jp: 'フランス', reading: 'フランス', vn: 'Pháp', part: 3, romaji: 'furansu' },
    { id: 25, jp: 'さいふ', reading: 'さいふ', vn: 'Ví', part: 3, romaji: 'saifu' },
    { id: 26, jp: 'えいご', reading: 'えいご', vn: 'Tiếng Anh', part: 3, romaji: 'eigo' },
    { id: 27, jp: '～ご', reading: '～ご', vn: 'Ngôn ngữ ~', part: 3, romaji: '~go' },
    { id: 28, jp: '～つ', reading: '～つ', vn: 'Cách đếm đồ vật', part: 3, romaji: '~tsu' },
    { id: 29, jp: 'だれ', reading: 'だれ', vn: 'Ai', part: 3, romaji: 'dare' },
    { id: 30, jp: 'ちゅうもんをおねがいします', reading: 'ちゅうもんをおねがいします', vn: 'Cho tôi gọi món', part: 3, romaji: 'chuumon o onegaishimasu' },
    { id: 31, jp: 'Nをおねがいします', reading: 'Nをおねがいします', vn: 'Làm ơn cho tôi N', part: 3, romaji: 'N o onegaishimasu' },
    { id: 32, jp: 'どうぞ', reading: 'どうぞ', vn: 'Xin mời', part: 3, romaji: 'douzo' },
    { id: 33, jp: 'ひとつ', reading: 'ひとつ', vn: '1 cái', part: 3, romaji: 'hitotsu' },

    // Phần 4: Số đếm đồ vật thuần Nhật
    { id: 34, jp: 'ふたつ', reading: 'ふたつ', vn: '2 cái', part: 4, romaji: 'futatsu' },
    { id: 35, jp: 'みっつ', reading: 'みっつ', vn: '3 cái', part: 4, romaji: 'mittsu' },
    { id: 36, jp: 'よっつ', reading: 'よっつ', vn: '4 cái', part: 4, romaji: 'yottsu' },
    { id: 37, jp: 'いつつ', reading: 'いつつ', vn: '5 cái', part: 4, romaji: 'itsutsu' },
    { id: 38, jp: 'むっつ', reading: 'むっつ', vn: '6 cái', part: 4, romaji: 'muttsu' },
    { id: 39, jp: 'ななつ', reading: 'ななつ', vn: '7 cái', part: 4, romaji: 'nanatsu' },
    { id: 40, jp: 'やっつ', reading: 'やっつ', vn: '8 cái', part: 4, romaji: 'yattsu' },
    { id: 41, jp: 'ここのつ', reading: 'ここのつ', vn: '9 cái', part: 4, romaji: 'kokonotsu' },
    { id: 42, jp: 'とお', reading: 'とお', vn: '10 cái', part: 4, romaji: 'too' },
    { id: 43, jp: 'いくつ', reading: 'いくつ', vn: 'Bao nhiêu cái', part: 4, romaji: 'ikutsu' },

    // Phần 5: Kanji N5 - Thời gian & Tự nhiên
    { id: 44, jp: '月', reading: 'つき', vn: 'mặt trăng', part: 5, romaji: 'tsuki', isKanji: true },
    { id: 45, jp: '一月', reading: 'いちがつ', vn: 'tháng 1', part: 5, romaji: 'ichigatsu', isKanji: true },
    { id: 46, jp: '十二月', reading: 'じゅうにがつ', vn: 'Tháng 12', part: 5, romaji: 'juunigatsu', isKanji: true },
    { id: 47, jp: '月曜日', reading: 'げつようび', vn: 'Thứ 2', part: 5, romaji: 'getsuyoubi', isKanji: true },
    { id: 48, jp: '花火', reading: 'はなび', vn: 'pháo hoa', part: 5, romaji: 'hanabi', isKanji: true },
    { id: 49, jp: '火', reading: 'ひ', vn: 'lửa', part: 5, romaji: 'hi', isKanji: true },
    { id: 50, jp: '火曜日', reading: 'かようび', vn: 'Thứ 3', part: 5, romaji: 'kayoubi', isKanji: true },
    { id: 51, jp: '水', reading: 'みず', vn: 'nước', part: 5, romaji: 'mizu', isKanji: true },
    { id: 52, jp: '水曜日', reading: 'すいようび', vn: 'Thứ 4', part: 5, romaji: 'suiyoubi', isKanji: true },
    { id: 53, jp: '木', reading: 'き', vn: 'Cây / gỗ', part: 5, romaji: 'ki', isKanji: true },
    { id: 54, jp: '木曜日', reading: 'もくようび', vn: 'Thứ 5', part: 5, romaji: 'mokuyoubi', isKanji: true },
    { id: 55, jp: 'お金', reading: 'おかね', vn: 'tiền', part: 5, romaji: 'okane', isKanji: true },
    { id: 56, jp: '金曜日', reading: 'きんようび', vn: 'Thứ 6', part: 5, romaji: 'kinyoubi', isKanji: true },
    { id: 57, jp: '土', reading: 'つち', vn: 'Đất', part: 5, romaji: 'tsuchi', isKanji: true },
    { id: 58, jp: '土曜日', reading: 'どようび', vn: 'Thứ 7', part: 5, romaji: 'doyoubi', isKanji: true },
    { id: 59, jp: '何', reading: 'なん/なに', vn: 'Cái gì', part: 5, romaji: 'nan / nani', isKanji: true },
    { id: 60, jp: '何月', reading: 'なんがつ', vn: 'tháng mấy', part: 5, romaji: 'nangatsu', isKanji: true },
    { id: 61, jp: '何人', reading: 'なんにん', vn: 'Mấy người', part: 5, romaji: 'nannin', isKanji: true },
    { id: 62, jp: '何曜日', reading: 'なんようび', vn: 'Thứ mấy', part: 5, romaji: 'nanyoubi', isKanji: true },
    { id: 63, jp: '何年', reading: 'なんねん', vn: 'Năm bao nhiêu', part: 5, romaji: 'nannen', isKanji: true },
    { id: 64, jp: '今年', reading: 'ことし', vn: 'Năm nay', part: 5, romaji: 'kotoshi', isKanji: true },
    { id: 65, jp: '九時', reading: 'くじ', vn: '9 giờ', part: 5, romaji: 'kuji', isKanji: true },
    { id: 66, jp: '何時', reading: 'なんじ', vn: 'Mấy giờ', part: 5, romaji: 'nanji', isKanji: true },
    { id: 67, jp: '時間', reading: 'じかん', vn: 'Thời gian', part: 5, romaji: 'jikan', isKanji: true },
    { id: 68, jp: '何時間', reading: 'なんじかん', vn: 'Mấy tiếng', part: 5, romaji: 'nanjikan', isKanji: true },
    { id: 69, jp: '分かります', reading: 'わかります', vn: 'Hiểu', part: 5, romaji: 'wakarimasu', isKanji: true },
    { id: 70, jp: '半分', reading: 'はんぶん', vn: 'Một nửa', part: 5, romaji: 'hanbun', isKanji: true },
    { id: 71, jp: '六分', reading: 'ろっぷん', vn: '6 phút', part: 5, romaji: 'roppun', isKanji: true }
];

// Theme màu sắc động cho các phần học (Tailwind classes)
const partColorThemes = {
    blue: {
        gradient: 'from-blue-50 to-indigo-50/40 hover:from-blue-100/70 hover:to-indigo-100/60',
        border: 'border-blue-200/70',
        tagText: 'text-blue-600',
        btnBg: 'bg-blue-600',
        badgeBg: 'bg-blue-100 text-blue-700'
    },
    emerald: {
        gradient: 'from-emerald-50 to-teal-50/40 hover:from-emerald-100/70 hover:to-teal-100/60',
        border: 'border-emerald-200/70',
        tagText: 'text-emerald-600',
        btnBg: 'bg-emerald-600',
        badgeBg: 'bg-emerald-100 text-emerald-700'
    },
    amber: {
        gradient: 'from-amber-50 to-orange-50/40 hover:from-amber-100/70 hover:to-orange-100/60',
        border: 'border-amber-200/70',
        tagText: 'text-amber-600',
        btnBg: 'bg-amber-600',
        badgeBg: 'bg-amber-100 text-amber-700'
    },
    purple: {
        gradient: 'from-purple-50 to-pink-50/40 hover:from-purple-100/70 hover:to-pink-100/60',
        border: 'border-purple-200/70',
        tagText: 'text-purple-600',
        btnBg: 'bg-purple-600',
        badgeBg: 'bg-purple-100 text-purple-700'
    },
    rose: {
        gradient: 'from-rose-50 to-red-50/40 hover:from-rose-100/70 hover:to-red-100/60',
        border: 'border-rose-200/70',
        tagText: 'text-rose-600',
        btnBg: 'bg-rose-600',
        badgeBg: 'bg-rose-100 text-rose-700'
    },
    indigo: {
        gradient: 'from-indigo-50 to-blue-50/40 hover:from-indigo-100/70 hover:to-blue-100/60',
        border: 'border-indigo-200/70',
        tagText: 'text-indigo-600',
        btnBg: 'bg-indigo-600',
        badgeBg: 'bg-indigo-100 text-indigo-700'
    }
};

// Bảng 46 âm Kana cơ bản chuẩn
const kanaAlphabet = [
    { h: 'あ', k: 'ア', r: 'a' },
    { h: 'い', k: 'イ', r: 'i' },
    { h: 'う', k: 'ウ', r: 'u' },
    { h: 'え', k: 'エ', r: 'e' },
    { h: 'お', k: 'オ', r: 'o' },

    { h: 'か', k: 'カ', r: 'ka' },
    { h: 'き', k: 'キ', r: 'ki' },
    { h: 'く', k: 'ク', r: 'ku' },
    { h: 'け', k: 'ケ', r: 'ke' },
    { h: 'こ', k: 'コ', r: 'ko' },

    { h: 'さ', k: 'サ', r: 'sa' },
    { h: 'し', k: 'シ', r: 'shi' },
    { h: 'す', k: 'ス', r: 'su' },
    { h: 'せ', k: 'セ', r: 'se' },
    { h: 'そ', k: 'ソ', r: 'so' },

    { h: 'た', k: 'タ', r: 'ta' },
    { h: 'ち', k: 'チ', r: 'chi' },
    { h: 'つ', k: 'ツ', r: 'tsu' },
    { h: 'て', k: 'テ', r: 'te' },
    { h: 'と', k: 'ト', r: 'to' },

    { h: 'な', k: 'ナ', r: 'na' },
    { h: 'に', k: 'ニ', r: 'ni' },
    { h: 'ぬ', k: 'ヌ', r: 'nu' },
    { h: 'ね', k: 'ネ', r: 'ne' },
    { h: 'の', k: 'ノ', r: 'no' },

    { h: 'は', k: 'ハ', r: 'ha' },
    { h: 'ひ', k: 'ヒ', r: 'hi' },
    { h: 'ふ', k: 'フ', r: 'fu' },
    { h: 'へ', k: 'ヘ', r: 'he' },
    { h: 'ほ', k: 'ホ', r: 'ho' },

    { h: 'ま', k: 'マ', r: 'ma' },
    { h: 'み', k: 'ミ', r: 'mi' },
    { h: 'む', k: 'ム', r: 'mu' },
    { h: 'め', k: 'メ', r: 'me' },
    { h: 'も', k: 'モ', r: 'mo' },

    { h: 'や', k: 'ヤ', r: 'ya' },
    { h: '', k: '', r: '' },
    { h: 'ゆ', k: 'ユ', r: 'yu' },
    { h: '', k: '', r: '' },
    { h: 'よ', k: 'ヨ', r: 'yo' },

    { h: 'ら', k: 'ラ', r: 'ra' },
    { h: 'り', k: 'リ', r: 'ri' },
    { h: 'る', k: 'ル', r: 'ru' },
    { h: 'れ', k: 'レ', r: 're' },
    { h: 'ろ', k: 'ロ', r: 'ro' },

    { h: 'わ', k: 'ワ', r: 'wa' },
    { h: '', k: '', r: '' },
    { h: '', k: '', r: '' },
    { h: '', k: '', r: '' },
    { h: 'を', k: 'ヲ', r: 'wo' },

    { h: 'ん', k: 'ン', r: 'n' }
];
