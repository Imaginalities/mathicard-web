# HƯỚNG DẪN VẬN HÀNH & PHÁT TRIỂN WEBSITE MATHICARD

Trang web quảng bá chính thức cho tựa game **Mathicard** – Đồ án bài tập lớn môn **Công nghệ đa phương tiện** (Lớp 68PM1, Khoa Công nghệ Thông tin, Trường Đại học Xây dựng Hà Nội).

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

## 2. HƯỚNG DẪN THAY THẾ PLACEHOLDER (DÀNH CHO ĐỒNG ĐỘI)

Toàn bộ nội dung chữ, đường dẫn ảnh, video và tài liệu học thuật được quản lý tập trung tại **DUY NHẤT một tệp**:
📁 **`web/js/content.js`**

Đồng đội trong nhóm khi hoàn thiện tài nguyên chỉ cần:
1. Đặt tệp mới đè lên tệp cũ cùng tên trong thư mục `assets/` hoặc `docs/`.
2. (Tùy chọn) Mở `web/js/content.js` để chỉnh sửa lại mô tả, điểm số hoặc tên thành viên.
3. **Tuyệt đối không cần chỉnh sửa các tệp HTML, CSS hay mã nguồn JavaScript khác!**

### Danh Sách Tệp Cần Thay Thế & Trạng Thái Hiện Tại:

| Hạng mục | Đường dẫn tệp | Trạng thái & Cơ chế fallback tự động | Người phụ trách |
|---|---|---|---|
| **Logo ngang** | `web/assets/logo/Logo_Mathicard_Ngang.png` | **Chờ thay thế**: Web tự động kiểm tra runtime HEAD; khi chưa có, tự động hiển thị wordmark pixel "MATHICARD" được tạo kiểu chuẩn CSS. Banner promo cũ đã chuyển vào `web/assets/images/PromoBanner.png`. | Trần Minh Bảo |
| **Logo icon** | `web/assets/logo/Logo_Mathicard_Icon.png` | **Đang dùng placeholder**: `Logo_Mathicard_Icon_placeholder.png`. Thay bằng icon PNG nền trong suốt 192x192 hoặc 512x512. | Trần Minh Bảo |
| **Bảng chữ cái** | `web/assets/logo/BangChu_Mathicard.png` | **Đang dùng placeholder**: `BangChu_Mathicard_placeholder.png`. Bản vẽ mẫu các ký tự của font tự thiết kế (A–Z, 0–9, tiếng Việt). | Trần Minh Bảo |
| **GIF Logo** | `web/assets/gif/Anim_Logo.gif` | **Đang dùng placeholder**: `Anim_Logo_placeholder.gif`. Thay bằng GIF động nền trong suốt. | Trần Minh Bảo |
| **GIF Lật bài** | `web/assets/gif/Anim_LatBai.gif` | Đã có: Ảnh động hiệu ứng lật bài 2 mặt trong game. | Trần Minh Bảo |
| **Key Art 16:9** | `web/assets/images/KeyArt.webp` | Đã có: Banner minh họa chính 1200x675 px. | Trần Minh Bảo |
| **Ảnh Showcase** | `web/assets/images/CardShowcase.webp` | Đã có: Banner các bộ bài & gói mở rộng. | Trần Minh Bảo |
| **Ảnh Đánh giá** | `web/assets/images/DanhGia.webp` | Đã có: Bảng điểm đánh giá đồ án. | Trần Minh Bảo |
| **Ảnh 5 Lượt** | `web/assets/images/Luot_01.webp` .. `Luot_05.webp` | Đã có: Minh họa 5 phase của vòng đấu. | Trần Minh Bảo |
| **Video Trailer** | `web/assets/video/Video_Mathicard_NoSub.mp4` | Đã có: Video gameplay/trailer kèm phụ đề VTT rời. | Trần Minh Bảo |
| **Phụ đề VTT** | `web/assets/video/Video_Mathicard.vtt` | Đã có: Tệp phụ đề WebVTT chuẩn hóa. | Trần Minh Bảo |
| **Bản dịch C11-12** | `web/docs/Dich_Ch11_12.pdf` & `.docx` | **Đang cập nhật**: Đã gỡ tài liệu giả. Web tự động kiểm tra HEAD; nút bấm tự vô hiệu hóa và hiện nhãn "ĐANG CẬP NHẬT". Khi đặt file thật vào, nút tự kích hoạt ngay. | Lê Hoàng Cường |
| **Nghiên cứu 2.2** | `web/docs/NC_2.2_JPEG_MPEG.pdf` & `.docx` | **Đang cập nhật**: Đã gỡ file giả; tự động kiểm tra HEAD runtime. | Phạm Quốc Dũng |
| **Nghiên cứu 2.3** | `web/docs/NC_2.3_Video.pdf` & `.docx` | **Đang cập nhật**: Đã gỡ file giả; tự động kiểm tra HEAD runtime. | Phạm Quốc Dũng |
| **Demo Nén** | `web/docs/Demo_Nen.ipynb` | **Đang cập nhật**: Đã gỡ file giả; tự động kiểm tra HEAD runtime. | Phạm Quốc Dũng |
| **Slide Thuyết trình**| `web/docs/Slide_68PM1_NhomXX.pdf` & `.pptx` | **Đang cập nhật**: Đã gỡ file giả; tự động kiểm tra HEAD runtime. | Nguyễn Văn An |

> 💡 **Cơ chế Runtime HEAD-check thông minh:** Website tự động thực hiện truy vấn HTTP HEAD đối với từng tệp trong `web/docs/` và `web/assets/logo/Logo_Mathicard_Ngang.png`. Nếu tệp chưa tồn tại trên máy chủ, giao diện tự động vô hiệu hóa nút bấm và hiển thị trạng thái *"ĐANG CẬP NHẬT"*, ngăn hoàn toàn lỗi HTTP 404. Khi thành viên nhóm hoàn thành và đặt tệp thật vào thư mục `docs/`, hệ thống lập tức mở khóa nút xem/tải mà không cần chỉnh sửa bất kỳ dòng mã nào.

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

## 4. CÁCH XUẤT TÀI LIỆU DOCX/PPTX SANG PDF (ĐỂ XEM TRỰC TUYẾN)

Trình duyệt web không thể mở trực tiếp tệp `.docx` hay `.pptx` trong thẻ `<iframe>`. Do đó, mỗi tài liệu cần một bản `.pdf` đi kèm để xem ngay trên website.

### Cách 1: Xuất tự động bằng LibreOffice (Dòng lệnh Linux/macOS)
```bash
# Cài đặt libreoffice nếu chưa có: sudo apt install libreoffice
soffice --headless --convert-to pdf web/docs/Dich_Ch11_12.docx --outdir web/docs/
soffice --headless --convert-to pdf web/docs/NC_2.2_JPEG_MPEG.docx --outdir web/docs/
soffice --headless --convert-to pdf web/docs/NC_2.3_Video.docx --outdir web/docs/
soffice --headless --convert-to pdf web/docs/Slide_68PM1_NhomXX.pptx --outdir web/docs/
```

### Cách 2: Xuất thủ công trên Microsoft Word / Google Docs
Mở file `.docx` trong Word hoặc Google Docs -> Chọn **File** -> **Save As** (hoặc **Download**) -> Chọn định dạng **PDF (*.pdf)** -> Lưu cùng tên vào thư mục `web/docs/`.

---

## 5. HƯỚNG DẪN TRIỂN KHAI LÊN GITHUB PAGES

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

## 6. KIẾN TRÚC KỸ THUẬT & HIỆU NĂNG

- **WebGL Custom Shader**: Viết bằng GLSL thuần, tạo chuyển động cuộn xoáy psychedelic phong cách Balatro nguyên bản với domain warping. Render ở độ phân giải 0.5x kết hợp CSS pixelated scaling giúp tiết kiệm GPU và chạy mượt 60 FPS trên mọi thiết bị.
- **Tự động ngắt Shader (Smart Lifecycle)**: Sử dụng `IntersectionObserver` và `visibilitychange` để tự động tạm dừng render loop khi người dùng cuộn khỏi Hero section hoặc chuyển tab.
- **Accessibility**: Tương thích tiêu chuẩn `prefers-reduced-motion` (tắt hiệu ứng lắc/rung, chuyển nền gradient tĩnh), hỗ trợ điều hướng toàn bộ phím Tab/Enter/Escape, độ tương phản văn bản đạt chuẩn WCAG AA >= 4.5:1.
- **Deploy Hygiene & Tinh gọn**: Thư mục `web/` đã có `.nojekyll` để đảm bảo GitHub Pages không bỏ qua các tài nguyên tĩnh. Toàn bộ kế hoạch (`PLAN.md`), công cụ kiểm thử CDP tự động (`verify_all.js`), và ảnh chụp màn hình kiểm định (`_screens/`) được chuyển sang thư mục phát triển riêng `web_dev/`, giúp thư mục phát hành `web/` luôn gọn gàng và tinh sạch.
- **Dung lượng trang siêu nhẹ**: Toàn bộ trang web (bao gồm đầy đủ hình ảnh, sprite cards, GIF và tài liệu) chỉ nặng **~1.7 MB** (thấp hơn nhiều so với hạn mức tối đa 3 MB của đề bài).
