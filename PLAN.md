# Kế Hoạch Phát Triển Website Mathicard (web/PLAN.md)

## 1. Mục Tiêu Dự Án
Xây dựng trang web quảng bá tĩnh (static promotional website) độc đáo cho tựa game **Mathicard** (dự án game của nhóm sinh viên lớp 68PM1), phục vụ bài tập lớn môn **Công nghệ đa phương tiện**.

Website được thiết kế theo phong cách retro-pixel card game (lấy cảm hứng từ năng lượng của *Balatro*, hoàn toàn tự viết mã và thiết kế nguyên bản, không sao chép tài nguyên hay mã nguồn), đảm bảo chuẩn thẩm mỹ hiện đại, hiệu năng cao (< 3 MB), hỗ trợ accessibility, responsive mượt mà từ 375px đến 1440px+ và chạy hoàn hảo trên static server lẫn GitHub Pages sub-path.

---

## 2. Bảng Màu (Palette) & CSS Variables
Bảng màu lấy cảm hứng từ card art của Mathicard, kết hợp giữa nền tối vũ trụ huyền ảo và các luồng xoáy màu retro neon ấm áp:

- **Nền cơ bản (Deep Teal / Space Navy)**:
  - `--bg-base`: `#0b1320`
  - `--bg-panel`: `rgba(16, 26, 43, 0.90)`
  - `--bg-card`: `rgba(23, 37, 61, 0.92)`
  - `--bg-card-hover`: `rgba(32, 52, 84, 0.96)`
- **Luồng xoáy Shader (Swirl Accent Colors)**:
  - `--swirl-col1`: `#0f2b48` (Deep navy blue)
  - `--swirl-col2`: `#184e68` (Deep teal ocean)
  - `--swirl-col3`: `#2a9d8f` (Vibrant cyan/emerald)
  - `--swirl-col4`: `#e76f51` (Warm amber coral)
- **Màu nhấn bài & phân loại (Card Tiers & Accents)**:
  - `--color-gold`: `#f4a261` (Vàng hoàng kim / Gold deck / Điểm số)
  - `--color-red`: `#e63946` (Đỏ lửa / Red deck / Phép tấn công)
  - `--color-blue`: `#3a86ff` (Xanh biển / Blue value / Toán tử)
  - `--color-green`: `#2ec4b6` (Xanh ngọc / Green deck)
  - `--color-purple`: `#8338ec` (Tím huyền bí / Purple deck / Spell)
  - `--color-coin`: `#ffd166` (Đồng xu vàng Coin)
  - `--color-bcoin`: `#e0a96d` (Đồng B-Coin)
- **Văn bản & Độ tương phản (Typography & Contrast >= 4.5:1)**:
  - `--text-main`: `#f8fafc` (Trắng sáng, độ tương phản ~13:1 trên panel)
  - `--text-muted`: `#94a3b8` (Xám bạc, độ tương phản ~5.2:1)
  - `--text-accent`: `#ffd166` (Vàng retro)
  - `--border-pixel`: `#334155`
  - `--border-gold`: `#f4a261`
  - `--btn-shadow`: `#070c14`

---

## 3. Font Chữ & Bằng Chứng Hỗ Trợ Tiếng Việt (Vietnamese Diacritics Proof)
Yêu cầu đề bài: Font hiển thị retro pixel cho tiêu đề phải hỗ trợ đầy đủ ký tự tiếng Việt có dấu (kiểm tra chuỗi: `"Đánh giá · Bốc bài · Cửa hàng · Tính điểm"`).

### Kiểm Tra Thực Tế Trên Google Fonts API:
1. **Pixelify Sans**: Thiếu subset tiếng Việt độc lập (`/* vietnamese */`), kiểm tra thực tế thiếu ký tự `ể` (điểm), `ố` (bốc), `ử` (cửa) dẫn đến fallback font lỗi nhịp glyph.
2. **Silkscreen**: Không hỗ trợ đầy đủ các nguyên âm có dấu móc và dấu ngã/hỏi của tiếng Việt.
3. **VT323 (ĐƯỢC CHỌN CHO HEADING/PIXEL UI)**:
   - Google Fonts cung cấp trực tiếp `/* vietnamese */` với dải `unicode-range: U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+0300-0301, U+0303-0304, U+0308-0309, U+0323, U+0329, U+1EA0-1EF9, U+20AB`.
   - Kết quả kiểm tra ký tự chuỗi `"Đánh giá · Bốc bài · Cửa hàng · Tính điểm Mathicard Sinh giá trị Đánh bài Cửa hàng"`: **100% ký tự được hỗ trợ trọn vẹn**, không bị rơi rụng glyph hay lỗi hiển thị.
4. **Be Vietnam Pro (ĐƯỢC CHỌN CHO BODY TEXT)**:
   - Font do designer Việt Nam phát triển đặc biệt tối ưu cho tiếng Việt, độ sắc nét cao ở mọi kích thước màn hình, độ tương phản tuyệt vời.

---

## 4. Cấu Trúc Các Phần Trên Trang (Single Page Sections)
1. **Sticky Header & Pixel Nav**:
   - Logo thương hiệu Mathicard + Icon game
   - Menu anchor: Giới thiệu | Luật 5 lượt | Thẻ bài | Đánh giá | Media | Tài liệu | Nhóm
   - Nút hành động nhanh: "Chơi Ngay / Trailer"
   - Hamburger menu responsive cho mobile
2. **Hero Section (`#hero`)**:
   - Slogan: *"Tính nhanh – Thắng lớn!"*
   - Dòng thẻ bài xòe quạt tương tác (Interactive Card Fan) với hiệu ứng 3D tilt và tản rộng khi hover.
   - 2 nút bấm retro chunky: "Xem trailer" (mở video modal) và "Khám phá game" (cuộn mượt xuống).
3. **Trailer Section (`#trailer`)**:
   - Trình phát video chuẩn HTML5 `<video>` với poster, điều khiển trực quan.
   - Phụ đề tiếng Việt chuẩn định dạng WebVTT (`<track kind="subtitles" srclang="vi" default>`).
   - Xử lý trạng thái thông minh: Khi file MP4 chưa được nộp, hiển thị poster nghệ thuật kèm thông báo trạng thái *"Trailer sắp ra mắt"* (bắt qua video error event), không bao giờ vỡ giao diện.
4. **Giới Thiệu Game & 5 Giai Đoạn Ván Đấu (`#gioi-thieu`)**:
   - Giới thiệu tổng quan: Game đấu trí toán học 2–4 người với nhịp độ dồn dập.
   - 5 thẻ bài 3D tương tác đại diện cho 5 phase trong lượt đấu:
     - Lượt 1: **Bốc bài** (Rút 8 lá bài giá trị lên tay và bài toán tử).
     - Lượt 2: **Sinh giá trị** (Hệ thống ngẫu nhiên công bố giá trị mục tiêu vòng).
     - Lượt 3: **Đánh bài** (Ghép bài số 1–9 và toán tử + − × ÷ thành biểu thức gần mục tiêu nhất).
     - Lượt 4: **Tính điểm** (Xếp hạng sai số, cộng điểm phòng, nhận Coin và BCoin).
     - Lượt 5: **Cửa hàng** (Dùng Coin/BCoin mua bài vật phẩm, gói bài, thẻ bổ trợ nâng cấp bộ bài).
   - Tương tác lật thẻ (3D Card Flip) khi click để xem chi tiết từng lượt.
5. **Bộ Sưu Tập Thẻ Bài (`#cac-loai-the`)**:
   - Bộ lọc phân loại thẻ:
     - **Giá trị**: Các số từ 1 đến 9 với 4 màu sắc chiến thuật.
     - **Toán tử**: Các phép toán cơ bản (+, −, ×, ÷) và nâng cao.
     - **Phép / Vật phẩm**: Cầu vồng, Jackpot, Cái đe, Tetris, Con tốt, Vệ tinh,...
     - **Bộ bài & Gói**: Các bộ bài Basedeck, Golddeck, Reddeck, Greendeck, Purpledeck và Gói thẻ mở rộng.
   - Hiệu ứng Card Wobble + 3D Hover Tilt.
   - Click mở Modal Card Inspector chi tiết phóng to, mô tả luật và chỉ số.
6. **Đánh Giá & Nhận Xét (`#danh-gia`)**:
   - Thẻ bài úp bí ẩn tự động lật ngửa (Card Flip) khi cuộn tới màn hình.
   - Điểm số tổng thể: **8.5 / 10** với hiệu ứng đếm số (tally animation) và rung nhẹ màn hình (subtle screen shake).
   - Biểu đồ điểm chi tiết dạng thanh tiến trình retro:
     - Lối chơi (Gameplay): 9.0 / 10
     - Đồ họa & Hiệu ứng: 8.5 / 10
     - Tính giáo dục: 9.0 / 10
     - Chơi cùng bạn bè: 8.0 / 10
   - Danh sách Ưu điểm & Điểm cần cải thiện.
7. **Thư Viện Media (`#media`)**:
   - Trưng bày Logo chính thức + Bảng chữ cái font tùy biến của nhóm kèm thuyết minh ý tưởng.
   - Bảng mẫu màu (Palette Swatches) với mã màu HEX tương tác sao chép nhanh.
   - Lưới hình ảnh độ nét cao (KeyArt, Showcase, Gameplay).
   - Thư viện ảnh động (GIF hiệu ứng lật bài 2 mặt, GIF logo động).
   - Lightbox modal xem ảnh phóng to.
8. **Tài Liệu Học Thuật (`#tai-lieu`)**:
   - 5 thẻ tài liệu chính theo yêu cầu BTL:
     1. Bản dịch Sách Fundamentals of Multimedia (Chương 11–12: MPEG & H.264/H.265).
     2. Báo cáo Nghiên cứu 2.2: Phân tích các bước nén mất dữ liệu trong JPEG/MPEG.
     3. Báo cáo Nghiên cứu 2.3: Công nghệ lưu trữ, phát lại và truyền luồng video.
     4. Mã nguồn Demo Nén & Xử lý đa phương tiện (`Demo_Nen.ipynb`).
     5. Slide báo cáo thuyết trình nhóm 68PM1 (`Slide_68PM1_NhomXX.pptx`).
   - Mỗi thẻ cung cấp nút **"Xem trực tuyến"** (mở modal xem PDF in-page) và **"Tải về"** (tải file gốc .docx/.pptx/.ipynb).
   - Kiểm tra sẵn sàng tài liệu: Thẻ nào chưa có file thực tế sẽ hiển thị trạng thái *"Đang cập nhật"* và làm mờ nút, tránh lỗi 404.
9. **Thông Tin Nhóm & Phân Công (`#nhom`)**:
   - Bảng thông tin nhóm lớp **68PM1 – Nhóm XX**.
   - Phân công cụ thể:
     - **Nguyễn Văn An**: Trưởng nhóm – Website, Slide báo cáo, Tổng hợp & Review.
     - **Trần Minh Bảo**: Media – Logo với font chữ tự tạo, Hình ảnh, Ảnh động, Video lồng tiếng + Phụ đề.
     - **Lê Hoàng Cường**: Dịch thuật – Fundamentals of Multimedia Chương 11 & 12.
     - **Phạm Quốc Dũng**: Nghiên cứu – Chuyên đề 2.2 & 2.3, Demo Code đa phương tiện.
10. **Footer**:
    - Thông tin bản quyền học tập, liên kết dự án, lời cảm ơn giảng viên bộ môn.

---

## 5. Danh Sách Sprite & Hình Ảnh Sử Dụng
Tất cả sprite sử dụng từ `assets_export/` đã được tối ưu WebP/PNG nhỏ gọn:
- **Logo & Thương hiệu**:
  - `web/assets/logo/Logo_Mathicard_Ngang.png`
  - `web/assets/logo/Logo_Mathicard_Icon.png`
  - `web/assets/logo/BangChu_Mathicard.png`
- **Ảnh Nghệ Thuật & 5 Lượt Chơi**:
  - `web/assets/images/KeyArt.webp`
  - `web/assets/images/CardShowcase.webp`
  - `web/assets/images/DanhGia.webp`
  - `web/assets/images/Luot_01.webp` đến `Luot_05.webp`
- **Thẻ Bài & Bộ Bài**:
  - Thẻ số 1-9: Cắt từ `raw/images/cards/ValueCard.png`
  - Thẻ toán tử +, −, ×, ÷: Cắt từ `raw/images/cards/Operator.png`
  - Thẻ vật phẩm / phép:
    - Cầu vồng (`sprites/ALLITEM2/0.png`)
    - Jackpot (`sprites/ALLITEM2/1.png`)
    - Tetris (`sprites/ALLITEM3/0.png`)
    - Cái đe (`sprites/ALLITEM3/2.png`)
    - Con tốt (`sprites/ALLITEM6/0.png`)
    - Vệ tinh (`sprites/ALLITEM5/1.png`)
  - Thẻ bộ bài:
    - `basedeck.webp`, `golddeck.webp`, `greendeck.webp`, `reddeck.webp`, `purpledeck.webp`, `graydeck.webp`
  - Thẻ gói bài:
    - `pack1.webp`, `pack2.webp`, `pack3.webp`
- **Ảnh Động (GIF)**:
  - `web/assets/gif/Anim_Logo.gif`: Logo chuyển màu / phát sáng viền.
  - `web/assets/gif/Anim_LatBai.gif`: Ghép từ 9 khung hình `sprites/ALLHIEUUNGTHE2MAT/0.png` đến `8.png`.
- **Biểu tượng Tiền Tệ**:
  - `coin.webp`, `bcoin.webp`
- **Video & Phụ Đề**:
  - `web/assets/video/Video_Mathicard_NoSub.mp4`
  - `web/assets/video/Video_Mathicard.vtt`
- **Script Chuyển Đổi Phụ Đề**:
  - `web/tools/srt2vtt.py` (chuyển đổi `.srt` thành `.vtt` chuẩn).
