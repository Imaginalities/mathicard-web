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

### Danh Sách Tệp Cần Thay Thế:

| Hạng mục | Đường dẫn tệp | Mô tả & Lưu ý | Người phụ trách |
|---|---|---|---|
| **Logo ngang** | `web/assets/logo/Logo_Mathicard_Ngang.png` | Logo chính thức có font thiết kế riêng (nền trong suốt PNG) | Trần Minh Bảo |
| **Logo icon** | `web/assets/logo/Logo_Mathicard_Icon.png` | Icon ứng dụng vuông 1:1 (khuyên dùng 192x192 hoặc 512x512) | Trần Minh Bảo |
| **Bảng chữ cái** | `web/assets/logo/BangChu_Mathicard.png` | Bản vẽ mẫu các ký tự của font tự thiết kế (A–Z, 0–9, tiếng Việt) | Trần Minh Bảo |
| **Key Art 16:9** | `web/assets/images/KeyArt.webp` | Hình ảnh minh họa chính của game (banner 1200x675 px) | Trần Minh Bảo |
| **Ảnh Showcase** | `web/assets/images/CardShowcase.webp` | Hình chụp hoặc banner các bộ bài & gói mở rộng | Trần Minh Bảo |
| **Ảnh Đánh giá** | `web/assets/images/DanhGia.webp` | Infographic bảng điểm đánh giá | Trần Minh Bảo |
| **Ảnh 5 Lượt** | `web/assets/images/Luot_01.webp` .. `Luot_05.webp` | Minh họa 5 phase: Bốc bài, Sinh số, Đánh bài, Tính điểm, Cửa hàng | Trần Minh Bảo |
| **GIF Logo** | `web/assets/gif/Anim_Logo.gif` | Ảnh động logo phát sáng/chuyển động | Trần Minh Bảo |
| **GIF Lật bài** | `web/assets/gif/Anim_LatBai.gif` | Ảnh động hiệu ứng lật bài 2 mặt trong game | Trần Minh Bảo |
| **Video Trailer** | `web/assets/video/Video_Mathicard_NoSub.mp4` | Video dưới 30 giây, có lồng tiếng, KHÔNG dán cứng phụ đề | Trần Minh Bảo |
| **Phụ đề VTT** | `web/assets/video/Video_Mathicard.vtt` | Tệp phụ đề WebVTT đồng bộ khớp giọng đọc tiếng Việt | Trần Minh Bảo |
| **Bản dịch C11-12** | `web/docs/Dich_Ch11_12.pdf` & `.docx` | Bản dịch sách *Fundamentals of Multimedia* (Chương 11 & 12) | Lê Hoàng Cường |
| **Nghiên cứu 2.2** | `web/docs/NC_2.2_JPEG_MPEG.pdf` & `.docx` | Báo cáo các bước nén mất dữ liệu trong JPEG & MPEG | Phạm Quốc Dũng |
| **Nghiên cứu 2.3** | `web/docs/NC_2.3_Video.pdf` & `.docx` | Báo cáo công nghệ lưu trữ, phát lại & truyền luồng video | Phạm Quốc Dũng |
| **Demo Nén** | `web/docs/Demo_Nen.ipynb` | Jupyter Notebook chạy demo thuật toán DCT & lượng tử hóa | Phạm Quốc Dũng |
| **Slide Thuyết trình**| `web/docs/Slide_68PM1_NhomXX.pdf` & `.pptx` | Bản trình chiếu báo cáo bài tập lớn của nhóm | Nguyễn Văn An |

> 💡 **Xử lý tài liệu chưa có:** Trong `web/js/content.js`, đặt `isReady: false` cho tài liệu đó. Thẻ bài trên web sẽ tự động hiện nhãn *"ĐANG CẬP NHẬT"* và vô hiệu hóa nút bấm, tránh phát sinh lỗi 404 cho giảng viên khi chấm bài!

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
- **Dung lượng trang siêu nhẹ**: Toàn bộ trang web (bao gồm đầy đủ hình ảnh, sprite cards, GIF và tài liệu PDF) chỉ nặng **~1.7 MB** (thấp hơn nhiều so với hạn mức tối đa 3 MB của đề bài).
