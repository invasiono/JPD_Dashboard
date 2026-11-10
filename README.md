# Nihongo Master (日本語マスター) - Japanese Learning & Kana Typing Web App

Một ứng dụng web đơn trang (**Single Page Application - SPA**) chuyên nghiệp, hiện đại, trực quan và tiện lợi, giúp người học tiếng Nhật tiếp cận bảng chữ cái Kana, từ vựng thông dụng, luyện gõ tiếng Nhật tức thì và **hoàn toàn có thể tùy chỉnh bài học theo nhu cầu cá nhân** (thêm, sửa, xóa phần học và từ vựng).

Dự án được tái cấu trúc theo mô hình **Modular Architecture** chuẩn mực và đi kèm **trình khởi chạy máy chủ Python chuyên nghiệp** (`main.py` / `run.py`) giúp khởi động và tự động mở trình duyệt chỉ với 1 lệnh đơn giản.

---

## 📑 Mục Lục (Table of Contents)
1. [Giới thiệu tổng quan](#-giới-thiệu-tổng-quan)
2. [Cấu trúc mã nguồn chuyên nghiệp (Project Architecture)](#-cấu-trúc-mã-nguồn-chuyên-nghiệp-project-architecture)
3. [Hướng dẫn khởi chạy ứng dụng (Getting Started)](#-hướng-dẫn-khởi-chạy-ứng-dụng-getting-started)
   - [Cách 1: Khởi chạy bằng Python Server (Khuyến nghị)](#cách-1-khởi-chạy-bằng-python-server-khuyến-nghị)
   - [Cách 2: Chạy trực tiếp qua trình duyệt](#cách-2-chạy-trực-tiếp-qua-trình-duyệt)
   - [Cách 3: Sử dụng Live Server trong VS Code](#cách-3-sử-dụng-live-server-trong-vs-code)
4. [Tính năng & Chức năng nổi bật](#-tính-năng--chức-năng-nổi-bật)
   - [1. Học & Luyện tập Từ vựng (Vocabulary Module)](#1-học--luyện-tập-từ-vựng-vocabulary-module)
   - [2. Tùy chỉnh & Quản lý Bài học (Lesson Customizer)](#2-tùy-chỉnh--quản-lý-bài-học-lesson-customizer)
   - [3. Dán & Nhập Hàng Loạt (Bulk Paste Import)](#3-dán--nhập-hàng-loạt-bulk-paste-import)
   - [4. Luyện gõ Kana Tự do & Thử thách Phản xạ (Typing Sandbox & Speed Drill)](#4-luyện-gõ-kana-tự-do--thử-thách-phản-xạ-typing-sandbox--speed-drill)
   - [5. Sổ tay Tra cứu & Bảng chữ cái Kana (Dictionary & Charts)](#5-sổ-tay-tra-cứu--bảng-chữ-cái-kana-dictionary--charts)
   - [6. Hệ thống Âm thanh & Phát âm (Audio & Speech System)](#6-hệ-thống-âm-thanh--phát-âm-audio--speech-system)
5. [Công nghệ sử dụng (Tech Stack)](#-công-nghệ-sử-dụng-tech-stack)
6. [Bảng quy tắc gõ Romaji ➔ Kana (Typing Guide)](#-bảng-quy-tắc-gõ-romaji--kana-typing-guide)

---

## 🌟 Giới thiệu tổng quan

**Nihongo Master** kết hợp giữa lý thuyết, thực hành phản xạ và khả năng cá nhân hóa cao:
- **Zero External Dependencies:** Không cần cài đặt `npm`, `node_modules` hay thư viện Python nặng nề nào.
- **Chuyển đổi tức thì (Real-time IME):** Gõ Romaji tới đâu, ký tự chuyển ngay sang Hiragana/Katakana tới đó thông qua WanaKana.
- **Tùy biến bài học:** Tự do thêm, sửa, xóa phần học và từ vựng theo giáo trình riêng.
- **Tự động lưu trữ:** Tích hợp LocalStorage và hỗ trợ xuất/nhập tệp JSON sao lưu.
- **Phát âm & Âm thanh:** Web Speech API (giọng đọc bản xứ) và Web Audio API (hiệu ứng tổng hợp chime/buzz).

---

## 📂 Cấu trúc mã nguồn chuyên nghiệp (Project Architecture)

Mã nguồn được phân tách theo từng module và tầng trách nhiệm rõ ràng, dễ bảo trì và mở rộng:

```text
japanese-learning-app/
├── main.py                     # Máy chủ HTTP Python chuyên nghiệp & tự động mở trình duyệt
├── run.py                      # Phím tắt chạy nhanh (shortcut khởi động)
├── index.html                  # Giao diện chính tinh gọn, layout & các khung modal
├── css/
│   └── style.css               # Tùy biến kiểu dáng, hiệu ứng animation & thanh cuộn
├── js/
│   ├── app.js                  # Điều phối chính: router SPA, tiện ích chung, toast & bootstrap
│   ├── data/
│   │   └── defaultData.js      # Dữ liệu 43 từ vựng gốc, 4 phần học, bảng 46 âm Kana & theme màu
│   ├── services/
│   │   ├── audio.js            # Dịch vụ âm thanh: Web Audio API (hiệu ứng) & Web Speech API (phát âm)
│   │   └── storage.js          # Dịch vụ lưu trữ: LocalStorage, xuất/nhập JSON & khôi phục mặc định
│   └── modules/
│       ├── vocab.js            # Module từ vựng: Trắc nghiệm (Quiz), Luyện gõ từ (IME) & Kết quả
│       ├── kanaTyping.js       # Module luyện gõ: Khung gõ tự do & Thử thách phản xạ (Speed Drill)
│       ├── dictionary.js       # Module tra cứu: Danh sách từ vựng & bảng chữ cái Hiragana/Katakana 50 âm
│       └── manage.js           # Module tùy chỉnh: Quản lý phần học & từ vựng (CRUD Modals, lọc & tìm kiếm)
└── README.md                   # Tài liệu hướng dẫn dự án chi tiết
```

---

## 💻 Hướng dẫn khởi chạy ứng dụng (Getting Started)

### Cách 1: Khởi chạy bằng Python Server (Khuyến nghị)
Mở cửa sổ dòng lệnh (Terminal / Command Prompt / PowerShell) tại thư mục dự án và chạy:

```bash
python main.py
```
*hoặc dùng shortcut:*
```bash
python run.py
```

**Các ưu điểm nổi bật của trình khởi chạy Python:**
- 🚀 **Tự động mở trình duyệt:** Sau khi máy chủ khởi động thành công, trình duyệt web mặc định sẽ tự động mở trang web `http://localhost:8000`.
- 🔍 **Tự động tìm cổng khả dụng:** Nếu cổng `8000` đang bị chiếm bởi một ứng dụng khác, máy chủ sẽ tự động dò tìm cổng trống tiếp theo (ví dụ: `8001`, `8002`...).
- 🎨 **Terminal Banner chuyên nghiệp:** Hiển thị giao diện terminal trực quan, mã màu ANSI và log truy cập chuẩn mực.
- 🚫 **Chống Cache (No-Cache):** Tự động gửi header vô hiệu hóa bộ nhớ đệm trình duyệt, đảm bảo mọi thay đổi code có hiệu lực ngay lập tức khi F5.
- 🛑 **Dừng an toàn:** Nhấn `Ctrl + C` bất cứ lúc nào để dừng máy chủ.

**Các tham số tùy chọn:**
```bash
# Chỉ định cổng cụ thể
python main.py -p 3000

# Chạy không tự động mở trình duyệt
python main.py --no-browser
```

---

### Cách 2: Chạy trực tiếp qua trình duyệt
Nhấp đúp chuột trực tiếp vào tệp `index.html` để mở trên bất kỳ trình duyệt web nào (Chrome, Edge, Firefox, Safari...).

---

### Cách 3: Sử dụng Live Server trong VS Code
Nếu bạn dùng VS Code, nhấp chuột phải vào `index.html` và chọn **Open with Live Server**.

---

## 🚀 Tính năng & Chức năng nổi bật

### 1. Học & Luyện tập Từ vựng (Vocabulary Module)
- **71 từ vựng thiết yếu** chia theo 5 chuyên đề (Đồ ăn, Đồ uống Katakana, Giao tiếp nhà hàng, Số đếm thuần Nhật, và Kanji N5 Thời gian & Tự nhiên) cùng chế độ Thử thách toàn bộ từ.
- **Trắc nghiệm (Quiz Mode):** Sinh ngẫu nhiên phương án, phản hồi xanh/đỏ trực quan, tự động phát âm khi trả lời.
- **Luyện gõ từ vựng (Word Typing Mode / IME):** Tự động chuyển ký tự Romaji sang Kana trực tiếp khi gõ qua **WanaKana**, hỗ trợ gợi ý Romaji và phím tắt `Enter`.
- **Tổng kết (Result Screen):** Đánh giá điểm số, tỷ lệ % chính xác kèm danh hiệu (100% 🏆, ≥80% 🌟, ≥50% 💪).

### 2. Tùy chỉnh & Quản lý Bài học (Lesson Customizer)
- **Quản lý Phần học:** Thêm phần mới, sửa tên/mô tả/màu sắc, xóa phần học kèm xác nhận an toàn. Tự động đồng bộ với giao diện học và tra cứu.
- **Quản lý Từ vựng:** Thêm từ mới (tự động gợi ý Romaji khi gõ tiếng Nhật), sửa từ, xóa từ.
- **Tìm kiếm & Lọc:** Tìm từ tức thì theo tiếng Nhật, Romaji hoặc nghĩa tiếng Việt; lọc theo từng phần học.
- **Sao lưu & Khôi phục:** Tự động lưu LocalStorage, tải tệp backup JSON, nạp tệp JSON hoặc khôi phục 43 từ gốc ban đầu.

### 3. Dán & Nhập Hàng Loạt (Bulk Paste Import)
Tính năng cho phép bạn dán nhanh hàng chục hoặc hàng trăm từ vựng từ file ghi chú cá nhân, giáo trình hoặc từ điển mà **không cần phải gõ tay từng từ một**:
- **Định dạng 3 dòng trực quan (3-line block):**
  ```text
  [Từ tiếng Nhật / Kanji]
  [Cách đọc Kana: Furigana / Hiragana / Katakana]
  [Nghĩa tiếng Việt]
  ```
- **Ví dụ thực tế:**
  ```text
  月
  つき
  mặt trăng

  一月
  いちがつ
  tháng 1

  何
  なん/なに
  Cái gì
  ```
- **Tự động nhận diện & Xem trước trực tiếp (Live Preview):**
  - Tự động lọc khoảng trắng thừa và dòng trống giữa các từ.
  - Tự động tạo phiên âm **Romaji chuẩn** thông qua WanaKana (hỗ trợ cả từ có nhiều cách đọc phân cách bằng dấu gạch chéo `/` như `なん/なに` ➔ `nan / nani`).
  - Hiển thị bảng xem trước (STT, Kanji, Kana, Romaji, Nghĩa) kèm đếm số lượng từ hợp lệ trước khi bấm nạp.
- **Tạo nhanh phần học mới ngay trong Modal:** Không cần thoát ra ngoài hay sợ mất văn bản đã dán.
- **Nút dán mẫu 1 chạm:** Tích hợp sẵn nút *"✨ Dán thử mẫu 28 từ Kanji"* để trải nghiệm và kiểm tra chức năng ngay lập tức.

### 4. Luyện gõ Kana Tự do & Thử thách Phản xạ (Typing Sandbox & Speed Drill)
- **Bàn phím Romaji ➔ Kana Tức Thì (Playground):** Khung gõ lớn chuyển sang Hiragana (`あ`) hoặc Katakana (`ア`), xem trước Romaji trực tiếp, công cụ Phát âm (TTS), Sao chép (Copy) và Xóa (Clear).
- **Thử thách Phản xạ (Speed Drill):** Flashcard ngẫu nhiên 46 âm Kana, tự động nhận diện kết quả đúng ngay khi gõ mà không cần bấm nộp, tích lũy chuỗi đúng liên tiếp (`🔥 Streak`).

### 5. Sổ tay Tra cứu & Bảng chữ cái Kana (Dictionary & Charts)
- **Thẻ Từ vựng:** Xem toàn bộ từ vựng theo bộ lọc, bấm thẻ để nghe phát âm.
- **Bảng chữ cái Hiragana & Katakana (Gojūon):** Lưới 50 âm chuẩn kèm Romaji, bấm vào để nghe đọc.

### 6. Hệ thống Âm thanh & Phát âm (Audio & Speech System)
- **Web Speech API:** Giọng đọc tiếng Nhật (`ja-JP`) chuẩn với tốc độ tối ưu người học (0.85x).
- **Web Audio API:** Hiệu ứng âm thanh tổng hợp nội bộ (Success Chime & Error Buzz).
- **Mute/Unmute:** Nút bật/tắt âm thanh tiện lợi trên thanh Header.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Thành phần | Công nghệ / Thư viện | Vai trò |
| :--- | :--- | :--- |
| **Máy chủ & Trình khởi chạy** | **Python 3 (Standard Library)** | Máy chủ HTTP cục bộ, auto-port, no-cache và tự động mở trình duyệt |
| **Giao diện & Cấu trúc** | **HTML5 & Vanilla JS (Modular)** | Cấu trúc SPA chia module rõ ràng, tải nhanh, không nặng nề |
| **Styling** | **Tailwind CSS (CDN) & Custom CSS** | Giao diện hiện đại, responsive mobile/desktop, hiệu ứng mượt mà |
| **Lưu trữ dữ liệu** | **LocalStorage API & JSON** | Lưu trữ bài học tự động trên trình duyệt, hỗ trợ sao lưu / phục hồi |
| **IME Chuyển đổi Romaji ➔ Kana** | **WanaKana.js (v5.3.1)** | Tự động chuyển đổi chuỗi gõ phím Romaji sang Hiragana/Katakana trực tiếp |
| **Phát âm Tiếng Nhật** | **Web Speech API (`SpeechSynthesis`)** | Đọc to ký tự và từ vựng giọng bản xứ `ja-JP` |
| **Hiệu ứng âm thanh** | **Web Audio API (`AudioContext`)** | Tự tạo âm thanh phản hồi chime/buzz không cần file MP3 ngoài |

---

## ⌨️ Bảng quy tắc gõ Romaji ➔ Kana (Typing Guide)

| Ký tự / Âm | Cách gõ Romaji | Kết quả Hiragana / Katakana | Ví dụ |
| :--- | :--- | :--- | :--- |
| **Âm ngắt (Sokuon)** | Gõ lặp lại phụ âm đi sau | `っ` / `ッ` | `matte` ➔ `まって`, `tonkatsu` ➔ `とんかつ` |
| **Âm mũi N** | Gõ `nn` hoặc `n'` | `ん` / `ン` | `nihon` / `nihonn` ➔ `にほん` |
| **Trường âm Katakana** | Gõ dấu gạch ngang `-` | `ー` | `ko-hi-` ➔ `コーヒー`, `kare-` ➔ `カレー` |
| **Âm ghép (Yōon)** | Gõ `kya`, `sha`, `chu`, `ryo`... | `きゃ`, `しゃ`, `ちゅ`, `りょ`... | `ryouri` ➔ `りょうり` |
| **Biến âm (Dakuon)** | Gõ `ga`, `za`, `da`, `ba`... | `が`, `ざ`, `だ`, `ば`... | `gohan` ➔ `ごはん`, `bi-ru` ➔ `ビール` |
| **Bán biến âm (Handakuon)** | Gõ `pa`, `pi`, `pu`, `pe`, `po` | `ぱ`, `ぴ`, `ぷ`, `ぺ`, `ぽ` | `su-pu` ➔ `スープ` |

---

## 📄 Bản quyền & Đóng góp
Dự án được xây dựng phục vụ mục đích học tập và nghiên cứu tiếng Nhật. Mọi đóng góp, đề xuất tính năng mới hoặc mở rộng bài học đều được hoan nghênh!
