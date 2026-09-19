# HƯỚNG DẪN VẬN HÀNH & PHÁT TRIỂN WEBSITE MATHICARD

Trang web quảng bá chính thức cho tựa game **Mathicard** – Đồ án bài tập lớn môn **Công nghệ đa phương tiện** (Khoa Công nghệ Thông tin, Trường Đại học Xây dựng Hà Nội).

---

## 1. CÁCH CHẠY THỬ TRANG WEB Ở LOCAL

Website được xây dựng hoàn toàn bằng **Static Web chuẩn hiện đại** (HTML5 + CSS3 + Vanilla JavaScript ES Modules, không sử dụng npm/build tool phức tạp). 

### Cách 1: Chạy bằng Python (Khuyên dùng)
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

### Cách 2: Sử dụng VS Code Live Server
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
| **Logo ngang** | `web/assets/logo/Logo_Mathicard_Ngang.png` | **Chờ thay thế**: Web tự động kiểm tra runtime HEAD; khi chưa có, tự động hiển thị wordmark pixel "MATHICARD" được tạo kiểu chuẩn CSS. Banner promo có trong `web/assets/images/PromoBanner.png`. |
| **Logo icon** | `web/assets/logo/Logo_Mathicard_Icon.png` | **Đang dùng placeholder**: `Logo_Mathicard_Icon_placeholder.png`. Thay bằng icon PNG nền trong suốt 192x192 hoặc 512x512. |
| **Bảng chữ cái** | `web/assets/logo/BangChu_Mathicard.png` | **Đang dùng placeholder**: `BangChu_Mathicard_placeholder.png`. Bản vẽ mẫu các ký tự của font pixel (A–Z, 0–9, tiếng Việt). |
| **GIF Logo** | `web/assets/gif/Anim_Logo.gif` | **Đang dùng placeholder**: `Anim_Logo_placeholder.gif`. Thay bằng GIF động nền trong suốt. |
| **GIF Lật bài** | `web/assets/gif/Anim_LatBai.gif` | Đã có: Ảnh động hiệu ứng lật bài 2 mặt trong game. |
| **Key Art 16:9** | `web/assets/images/KeyArt.webp` | Đã có: Banner minh họa chính 1200x675 px. |
| **Ảnh Showcase** | `web/assets/images/CardShowcase.webp` | Đã có: Banner các bộ bài & gói mở rộng. |
| **Ảnh Đánh giá** | `web/assets/images/DanhGia.webp` | Đã có: Bảng điểm đánh giá đồ án. |
| **Ảnh 5 Lượt** | `web/assets/images/Luot_01.webp` .. `Luot_05.webp` | Đã có: Minh họa 5 phase của vòng đấu. |
| **Video Trailer** | `web/assets/video/Video_Mathicard_Sub.mp4` | Đã có: Video giới thiệu trò chơi kèm phụ đề tiếng Việt. |
| **Phụ đề VTT** | `web/assets/video/Video_Mathicard.vtt` | Đã có: Tệp phụ đề WebVTT chuẩn hóa. |

> 💡 **Cơ chế Runtime HEAD-check thông minh:** Website tự động thực hiện truy vấn HTTP HEAD đối với các tài nguyên động (như `web/assets/logo/Logo_Mathicard_Ngang.png`). Nếu tệp chưa tồn tại trên máy chủ, giao diện tự động chuyển sang cơ chế fallback thích hợp (wordmark CSS), ngăn hoàn toàn lỗi hiển thị ảnh vỡ.

---

## 3. CÔNG CỤ CHUYỂN ĐỔI PHỤ ĐỀ (.SRT → .VTT)

Trình duyệt web chuẩn hóa sử dụng định dạng **WebVTT** (`.vtt`) cho thẻ `<track>`. Nếu bạn làm phụ đề bằng phần mềm xuất ra `.srt`, hãy dùng script có sẵn trong thư mục `web/tools/`:

```bash
# Cú pháp:
python3 web/tools/srt2vtt.py <duong_dan_file.srt> [duong_dan_file.vtt]

# Ví dụ chuyển đổi trực tiếp:
python3 web/tools/srt2vtt.py my_subtitles.srt web/assets/video/Video_Mathicard.vtt
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
