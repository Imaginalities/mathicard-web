# HƯỚNG DẪN VẬN HÀNH & PHÁT TRIỂN WEBSITE MATHICARD

Trang web quảng bá chính thức cho tựa game **Mathicard** – Đồ án bài tập lớn môn **Công nghệ đa phương tiện** (Khoa Công nghệ Thông tin, Trường Đại học Xây dựng Hà Nội).

---

## 1. CÁCH CHẠY THỬ TRANG WEB Ở LOCAL

Website được xây dựng hoàn toàn bằng **Static Web chuẩn hiện đại** (HTML5 + CSS3 + Vanilla JavaScript thuần, không cần web server, không phụ thuộc npm hay build tool). 

### Cách 1: Mở index.html bằng trình duyệt (không cần cài đặt gì)
- Nhấp đúp chuột trực tiếp vào tệp `web/index.html` (giao thức `file://` trên Google Chrome, Mozilla Firefox, Microsoft Edge,...).
- Toàn bộ tính năng (shader WebGL nền, bộ sưu tập 275 thẻ bài, video trailer, font chữ pixel, cơ chế tự động nhận diện ảnh/video) đều hoạt động trơn tru ngay lập tức mà **không cần bất kỳ máy chủ nào**.

### Cách 2: Chạy bằng Python (Tùy chọn)
Mở terminal tại thư mục gốc của đồ án hoặc thư mục `web/`:

```bash
# Phục vụ từ thư mục gốc đồ án (để kiểm tra chạy trên sub-path /web/):
cd /home/life/Documents/CNDPT
python3 -m http.server 8000

# Sau đó mở trình duyệt tại:
# http://localhost:8000/web/
```

Hoặc phục vụ trực tiếp thư mục `web/`:
```bash
cd /home/life/Documents/CNDPT/web
python3 -m http.server 8000
# Mở: http://localhost:8000/
```

### Cách 3: Sử dụng VS Code Live Server
Cài đặt extension **Live Server** trong VS Code, mở tệp `web/index.html` và nhấn nút **Go Live** ở thanh trạng thái dưới cùng.

---

## 2. HƯỚNG DẪN THAY THẾ TÀI NGUYÊN (MEDIA ASSETS)

Toàn bộ nội dung chữ, đường dẫn ảnh và video được quản lý tập trung tại **DUY NHẤT một tệp**:
📁 **`web/js/content.js`**

Khi cập nhật tài nguyên:
1. Đặt tệp mới đè lên tệp cũ cùng tên trong thư mục `assets/`.
2. (Tùy chọn) Mở `web/js/content.js` để chỉnh sửa lại mô tả, tiêu đề hoặc thông số.
3. **Tuyệt đối không cần chỉnh sửa các tệp HTML, CSS hay mã nguồn JavaScript khác!**

### Danh Sách Tài Nguyên Media & Trạng Thái Hiện Tại:

| Hạng mục | Đường dẫn tệp | Trạng thái & Cơ chế fallback tự động |
|---|---|---|
| **Logo ngang** | `web/assets/logo/Logo_Mathicard_Ngang.png` | **Chờ thay thế**: Web tự động kiểm tra qua Image element event (onload/onerror); khi chưa có, tự động hiển thị wordmark pixel "MATHICARD" được tạo kiểu chuẩn CSS bằng font `Mathicard 3D`. Banner promo có trong `web/assets/images/PromoBanner.png`. |
| **Logo icon** | `web/assets/logo/Logo_Mathicard_Icon.png` | **Chờ thay thế**: Web tự động kiểm tra qua Image element event (onload/onerror); khi chưa có, favicon giữ sạch không phát sinh lỗi 404. Thay bằng icon PNG nền trong suốt 192x192 hoặc 512x512. |
| **Bảng chữ cái** | `web/assets/logo/BangChu_Mathicard.png` | **Đã cài đặt chính thức**: Bản vẽ mẫu kích thước 2000×2344 của bộ font Mathicard do nhóm tự thiết kế (228 ký tự, đầy đủ dấu tiếng Việt). Bấm vào để mở xem chi tiết trong lightbox. |
| **GIF / WebP Logo** | `web/assets/gif/Anim_Logo.webp`, `web/assets/gif/Anim_Logo.gif` | Đã có: Ảnh động biểu trưng logo Mathicard trích từ đoạn mở đầu của game (WebP có fallback GIF). |
| **GIF Ghép phép tính** | `web/assets/gif/Anim_GhepPhepTinh.gif` | Chờ cập nhật: Ô dự phòng hiển thị "Ảnh động sắp cập nhật". |
| **Key Art 16:9** | `web/assets/images/KeyArt.webp` | Đã có: Banner minh họa chính 1200x675 px. |
| **Ảnh Showcase** | `web/assets/images/CardShowcase.webp` | Đã có: Banner các bộ bài & gói mở rộng. |
| **Ảnh Đánh giá** | `web/assets/images/DanhGia.webp` | Đã có: Bảng điểm đánh giá đồ án. |
| **Ảnh 5 Lượt** | `web/assets/images/Luot_01.webp` .. `Luot_05.webp` | Đã có: Minh họa 5 phase của vòng đấu. |
| **Video Trailer** | `web/assets/video/Video_Mathicard_Sub.mp4` | Đã có: Video giới thiệu trò chơi với phụ đề tiếng Việt được gắn cứng (burned-in). Trình duyệt không tải hay hiển thị phụ đề trùng lặp. |
| **Poster Trailer** | `web/assets/video/poster.webp` | Đã có: Poster tĩnh 1280x720 chất lượng cao trích từ khung hình logo Mathicard phát sáng. |
| **Trailer Loop Overlay** | `web/assets/video/logo_loop.mp4` | Đã có: Video vòng lặp không tiếng (H.264, 1280x720, +faststart) làm thumbnail động phủ lên trailer. |

> 💡 **Phông chữ hiển thị (Display Font):** Trang web sử dụng bộ phông chữ pixel do nhóm tự thiết kế: `Mathicard` (dành cho toàn bộ văn bản hiển thị như nút bấm, nhãn phân loại, tiêu đề giai đoạn, thẻ bài, modal) và `Mathicard 3D` (dành riêng cho logo wordmark và các tiêu đề mục lớn nhất) tại `web/assets/fonts/` và `web/css/fonts/`. Phông chữ gồm 228 ký tự, hỗ trợ đầy đủ 100% tiếng Việt có dấu theo chuẩn thiết kế UNICASE (`text-transform: uppercase`). Đối với 20 ký hiệu toán học và điều hướng đặc thù mà phông chữ mới chưa có (` ``, `·`, `×`, `÷`, `–`, `↓`, `−`, `√`, `≤`, `≥`, `⌈`, `⌉`, `⌊`, `⌋`, `▶`, `☰`, `✕`, `Σ`, `π`, `φ`), hệ thống tự động kế thừa cơ chế dự phòng (symbol fallback) chuẩn xác từ phông chữ `Mathicard Display` (`MathicardDisplay.woff2`) thông qua chuỗi fallback CSS: `font-family: "Mathicard", "Mathicard Display", sans-serif;` (và `"Mathicard 3D", "Mathicard Display", sans-serif;`), đảm bảo tuyệt đối không có bất kỳ ký tự nào bị lỗi hiển thị (tofu box). Phông chữ nội dung (body text) sử dụng Be Vietnam Pro.

---

## 3. PHỤ ĐỀ VIDEO TRAILER & XỬ LÝ TRÙNG LẶP

Video trailer chính thức (`web/assets/video/Video_Mathicard_Sub.mp4`) đã có sẵn phụ đề tiếng Việt được gắn cứng trực tiếp vào luồng hình ảnh (burned-in subtitles).
Theo yêu cầu thiết kế và trải nghiệm người dùng, tệp phụ đề mẫu `Video_Mathicard.vtt`, thẻ `<track>` và các logic kiểm tra HEAD request đã được gỡ bỏ hoàn toàn; trình duyệt không hiển thị bất kỳ lớp phụ đề DOM nào đè lên video để tránh hiện tượng phụ đề kép (double subtitles).

Script `web/tools/srt2vtt.py` được lưu lại dưới dạng công cụ tiện ích nếu cần chuyển đổi `.srt` sang `.vtt` trong các kịch bản sử dụng độc lập:
```bash
python3 web/tools/srt2vtt.py <duong_dan_file.srt> [duong_dan_file.vtt]
```

---

## 4. HƯỚNG DẪN TRIỂN KHAI LÊN GITHUB PAGES

Trang web đã được cấu hình **100% đường dẫn tương đối** (`css/...`, `js/...`, `assets/...`), đảm bảo chạy hoàn hảo trên bất kỳ tên miền phụ hoặc sub-path nào của GitHub Pages:

1. Đưa thư mục `web/` lên repository GitHub của bạn:
   ```bash
   cd /home/life/Documents/CNDPT/web
   git add .
   git commit -m "Phat hanh website Mathicard phien ban quang ba"
   # git remote add origin https://github.com/<username>/<repo>.git
   # git push -u origin main
   ```
2. Trên trang quản lý repository GitHub:
   - Truy cập **Settings** -> Mục **Pages** ở thanh bên trái.
   - Tại phần **Build and deployment**:
     - Source: Chọn `Deploy from a branch`.
     - Branch: Chọn nhánh chính (ví dụ `main` hoặc `gh-pages`) và thư mục gốc `/ (root)` nếu bạn push riêng thư mục `web`, hoặc `/web` nếu push toàn bộ project.
   - Nhấn **Save**.
3. Sau khoảng 1–2 phút, trang web sẽ hoạt động trực tuyến tại:
   `https://<username>.github.io/<repo>/`

---

## 5. KIẾN TRÚC KỸ THUẬT & HIỆU NĂNG

- **WebGL Custom Shader**: Viết bằng GLSL thuần, tạo chuyển động cuộn xoáy psychedelic phong cách Balatro nguyên bản với domain warping. Render ở độ phân giải 0.5x kết hợp CSS pixelated scaling giúp tiết kiệm GPU và chạy mượt 60 FPS trên mọi thiết bị.
- **Tự động ngắt Shader (Smart Lifecycle)**: Sử dụng `IntersectionObserver` và `visibilitychange` để tự động tạm dừng render loop khi người dùng cuộn khỏi Hero section hoặc chuyển tab.
- **Accessibility**: Tương thích tiêu chuẩn `prefers-reduced-motion` (tắt hiệu ứng lắc/rung, chuyển nền gradient tĩnh), hỗ trợ điều hướng toàn bộ phím Tab/Enter/Escape, độ tương phản văn bản đạt chuẩn WCAG AA >= 4.5:1.
- **Deploy Hygiene & Tinh gọn**: Thư mục `web/` đã có `.nojekyll` để đảm bảo GitHub Pages không bỏ qua các tài nguyên tĩnh. Toàn bộ kế hoạch (`PLAN.md`), công cụ kiểm thử CDP tự động (`verify_all.js`), và ảnh chụp màn hình kiểm định (`_screens/`) được chuyển sang thư mục phát triển riêng `web_dev/`, giúp thư mục phát hành `web/` luôn gọn gàng và tinh sạch.
- **Dung lượng trang siêu nhẹ**: Toàn bộ trang web (bao gồm đầy đủ hình ảnh, sprite cards và GIF) chỉ nặng **~1.7 MB** (thấp hơn nhiều so với hạn mức tối đa 3 MB của đề bài).
