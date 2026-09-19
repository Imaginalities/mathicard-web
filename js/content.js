/**
 * =============================================================================
 * MATHICARD - DỮ LIỆU NỘI DUNG TOÀN TRANG (web/js/content.js)
 * =============================================================================
 * TỆP TRUNG TÂM DUY NHẤT CHỨA NỘI DUNG, ĐƯỜNG DẪN TÀI NGUYÊN VÀ THÔNG TIN DỰ ÁN.
 * Các thành viên trong nhóm chỉ cần chỉnh sửa nội dung trong file này hoặc thay
 * thế file tài nguyên cùng tên trong thư mục `assets/` và `docs/`.
 * KHÔNG CẦN CHỈNH SỬA MÃ NGUỒN HTML/CSS/JS KHÁC!
 * =============================================================================
 */

export const siteContent = {
  // 1. THÔNG TIN CHUNG VỀ DỰ ÁN & WEBSITE
  meta: {
    siteTitle: "Mathicard – Game Thẻ Bài Toán Học Đối Kháng",
    slogan: "Tính nhanh – Thắng lớn!",
    subSlogan: "Game thẻ bài số học 2–4 người: Kết hợp phép tính siêu tốc, xây dựng bộ bài ma thuật và chinh phục đỉnh cao!",
    tagline: "Bài tập lớn môn Công nghệ đa phương tiện · Lớp 68PM1 · Nhóm XX",
    gameEngine: "Godot 4 + C# (Được cấp phép sử dụng)",
    version: "v1.0.0-web"
  },

  // 2. PHẦN HERO & ĐIỀU HƯỚNG NHANH
  hero: {
    logoImg: "assets/logo/Logo_Mathicard_Ngang.png",
    logoAlt: "Logo chính thức của game Mathicard",
    badgeText: "GAME THẺ BÀI TOÁN HỌC ĐỐI KHÁNG",
    slogan: "Tính nhanh – Thắng lớn!",
    description: "Đấu trường thẻ bài toán học 2–4 người chơi theo lượt. Vận dụng tư duy logic, kết hợp các thẻ số 1–9 cùng toán tử cơ bản để tiệm cận mục tiêu vòng đấu và nâng cấp bộ bài tại Cửa hàng!",
    buttons: {
      trailer: {
        text: "Xem trailer",
        icon: "▶",
        target: "#trailer"
      },
      explore: {
        text: "Khám phá game",
        icon: "↓",
        target: "#gioi-thieu"
      }
    },
    // Dãy thẻ bài xòe quạt tương tác ở Hero (Phong cách "8 − 8 = ?" thuần CSS text cards)
    fannedCards: [
      {
        id: "hero-val-8-red",
        title: "Thẻ Số 8 (Đỏ)",
        render: "text",
        type: "value",
        value: "8",
        color: "red",
        colorHex: "#d91f17"
      },
      {
        id: "hero-op-sub",
        title: "Toán tử Trừ (−)",
        render: "text",
        type: "operator",
        symbol: "−",
        color: "dark",
        colorHex: "#1a1a1a"
      },
      {
        id: "hero-val-8-blue",
        title: "Thẻ Số 8 (Xanh dương)",
        render: "text",
        type: "value",
        value: "8",
        color: "blue",
        colorHex: "#1461bd"
      },
      {
        id: "hero-op-eq",
        title: "Dấu Bằng (=)",
        render: "text",
        type: "operator",
        symbol: "=",
        color: "dark",
        colorHex: "#1a1a1a"
      },
      {
        id: "hero-val-target",
        title: "Mục tiêu (? - Vàng)",
        render: "text",
        type: "value",
        value: "?",
        color: "yellow",
        colorHex: "#cc7a00"
      }
    ]
  },

  // 3. VIDEO TRAILER & PHỤ ĐỀ
  trailer: {
    sectionTitle: "TRAILER GAME & GAMEPLAY",
    sectionSubtitle: "Video giới thiệu và hướng dẫn luật chơi Mathicard dưới 30 giây",
    videoSrc: "assets/video/Video_Mathicard_Sub.mp4",
    posterImg: "assets/video/poster.webp",
    posterAlt: "Poster video Mathicard",
    trackSrc: "assets/video/Video_Mathicard.vtt",
    trackLang: "vi",
    trackLabel: "Tiếng Việt (Có dấu)",
    durationText: "Thời lượng: < 30 giây · Lồng tiếng & Phụ đề tiếng Việt",
    // Trạng thái dự phòng khi đồng đội chưa kịp nộp file MP4
    placeholderTitle: "Trailer sắp ra mắt!",
    placeholderMessage: "Nhóm Media đang hoàn thiện bản dựng video lồng tiếng và ghép phụ đề WebVTT chuẩn xác. Mời bạn khám phá luật chơi và các bộ thẻ bài bên dưới!"
  },

  // 4. GIỚI THIỆU TỔNG QUAN & 5 GIAI ĐOẠN VÁN ĐẤU
  overview: {
    sectionBadge: "CƠ CHẾ TRÒ CHƠI",
    sectionTitle: "LUẬT CHƠI & 5 LƯỢT ĐẤU",
    sectionSubtitle: "Chuỗi 5 giai đoạn vòng lặp khép kín trong mỗi vòng đấu Mathicard",
    pitch: "Mỗi ván đấu Mathicard là một cuộc đua điểm số căng thẳng giữa 2–4 người chơi. Mục tiêu là trở thành người đầu tiên tích lũy đủ điểm phòng (20, 30 hoặc 50 điểm) thông qua việc kết hợp thẻ số và thẻ phép tính.",
    phases: [
      {
        id: 1,
        stepNumber: "01",
        name: "Lượt 1 – Bốc bài",
        subtitle: "Rút bài từ cọc",
        iconImg: "assets/screens/SS_05_BocBai.webp",
        iconAlt: "Giai đoạn 1: Bốc bài",
        brief: "Rút đủ 8 lá bài số lên tay từ cọc bài và nhận 4 thẻ phép tính cơ bản (+, −, ×, /) sẵn sàng vào trận.",
        detail: "Mỗi người chơi bắt đầu với cọc bài 36 lá số (1–9, mỗi số 4 lá). Khung toán tử lưu trữ các phép tính cơ bản hoặc nâng cao được mua từ Cửa hàng."
      },
      {
        id: 2,
        stepNumber: "02",
        name: "Lượt 2 – Sinh giá trị",
        subtitle: "Mục tiêu vòng đấu",
        iconImg: "assets/screens/SS_06_DanhBai.webp",
        iconAlt: "Giai đoạn 2: Sinh giá trị",
        brief: "Hệ thống tự động phát sinh một số nguyên ngẫu nhiên làm giá trị mục tiêu chung cho toàn bộ người chơi.",
        detail: "Tất cả người chơi trong phòng đều chung một mục tiêu số này. Tốc độ và tư duy ghép phép tính tiệm cận quyết định vị thế thắng bại."
      },
      {
        id: 3,
        stepNumber: "03",
        name: "Lượt 3 – Đánh bài & Chốt",
        subtitle: "Ghép phép tính & Đáp án",
        iconImg: "assets/screens/SS_06_DanhBai.webp",
        iconAlt: "Giai đoạn 3: Đánh bài",
        brief: "Đặt thẻ số và phép tính thành biểu thức toán học tiệm cận mục tiêu, rồi nhấn nút Chốt để hoàn thành đáp án.",
        detail: "Người chơi có thể kích hoạt thêm các thẻ vật phẩm, thẻ Khóa học hoặc nhãn dán bổ trợ để nhân đôi điểm hoặc biến đổi số linh hoạt."
      },
      {
        id: 4,
        stepNumber: "04",
        name: "Lượt 4 – Tính điểm & Kết quả",
        subtitle: "So sánh độ lệch",
        iconImg: "assets/screens/SS_07_TinhDiem.webp",
        iconAlt: "Giai đoạn 4: Tính điểm",
        brief: "So sánh kết quả biểu thức với giá trị mục tiêu; trao thưởng điểm phòng, tiền Coin và BCoin danh giá.",
        detail: "Người về Nhất giành nhiều điểm phòng nhất để tiến gần chiến thắng chung cuộc, đồng thời tích lũy Coin và BCoin chuẩn bị cho lượt mua sắm."
      },
      {
        id: 5,
        stepNumber: "05",
        name: "Lượt 5 – Cửa hàng & Đổi mới",
        subtitle: "Nâng cấp bộ bài & Vòng tiếp",
        iconImg: "assets/screens/SS_08_CuaHang.webp",
        iconAlt: "Giai đoạn 5: Cửa hàng",
        brief: "Sử dụng Coin và BCoin mua sắm Khóa học, vật phẩm, gói bài mới, bấm Đổi mới (Reroll) hoặc nhấn Vòng tiếp.",
        detail: "Sau khi hết thời gian Cửa hàng hoặc tất cả bấm Vòng tiếp, ván đấu lập tức quay lại Lượt 1 (Bốc bài) với sức mạnh bộ bài mới cho đến khi tìm ra người chiến thắng!"
      }
    ]
  },

  // 5. BỘ SƯU TẬP THẺ BÀI (GALLERY CONFIGURATION)
  cardGallery: {
    sectionBadge: "BỘ SƯU TẬP THẺ",
    sectionTitle: "BỘ THẺ BÀI MATHICARD",
    sectionSubtitle: "Khám phá 275 thẻ bài trích xuất từ dữ liệu game: Giá trị, Toán tử, Vật phẩm, Khóa học, Tài liệu, Trang trí, Nhãn dán, Sự kiện, Gói bài",
    categories: [
      { key: "all", label: "Tất cả" },
      { key: "value", label: "Giá trị" },
      { key: "operator", label: "Toán tử" },
      { key: "item", label: "Vật phẩm" },
      { key: "course", label: "Khóa học" },
      { key: "document", label: "Tài liệu" },
      { key: "decoration", label: "Trang trí" },
      { key: "sticker", label: "Nhãn dán" },
      { key: "event", label: "Sự kiện" },
      { key: "pack", label: "Gói bài" }
    ],
    rarities: [
      { key: "all", label: "Tất cả độ hiếm" },
      { key: "common", label: "Phổ biến" },
      { key: "rare", label: "Hiếm" },
      { key: "epic", label: "Sử thi" },
      { key: "legendary", label: "Huyền thoại" },
      { key: "special", label: "Đặc biệt" }
    ]
  },

  // 6. ĐÁNH GIÁ & NHÌN NHẬN (DEV EVALUATION - 3 CỘT)
  devEvaluation: {
    sectionBadge: "ĐÁNH GIÁ & NHÌN NHẬN",
    sectionTitle: "ĐÁNH GIÁ & NHÌN NHẬN",
    sectionSubtitle: "Phân tích thẳng thắn về điểm mạnh, những điểm còn hạn chế và định hướng phát triển của Mathicard",
    columns: [
      {
        id: "strengths",
        title: "Điểm mạnh",
        icon: "⚡",
        tag: "ƯU ĐIỂM CỐT LÕI",
        items: [
          "Vòng lặp 5 lượt đấu (Bốc bài, Sinh giá trị, Đánh bài & Chốt, Tính điểm, Cửa hàng) chặt chẽ, tạo nhịp độ đối kháng nhanh và cuốn hút.",
          "Hệ thống thẻ đồ sộ (275 thẻ) với 9 phân loại rõ rệt, kết hợp sáng tạo giữa số học cơ bản, hàm toán tử và thẻ bổ trợ chiến thuật.",
          "Phong cách đồ họa Retro Pixel đồng bộ, hiệu ứng WebGL Shader sống động và chuyển động thẻ bài vật lý chân thực.",
          "Cơ chế kinh tế hai đồng tiền Coin và BCoin giúp tối ưu hóa chiều sâu chiến thuật xây dựng bộ bài qua từng vòng đấu."
        ]
      },
      {
        id: "limitations",
        title: "Hạn chế hiện tại",
        icon: "⚠",
        tag: "ĐIỂM CẦN HOÀN THIỆN",
        items: [
          "Phụ thuộc vào đường truyền mạng thời gian thực; chưa có cơ chế bù trễ khi kết nối WebSocket của người chơi bị gián đoạn.",
          "Chưa có chế độ đấu tập ngoại tuyến (Offline AI Bot) để người mới làm quen với luật chơi và thử nghiệm bộ bài tự do.",
          "Hệ thống âm thanh hiệu ứng (SFX) và nhạc nền (BGM) 8-bit còn đang trong quá trình thu âm, chưa bao phủ toàn bộ thao tác.",
          "Thời gian suy nghĩ ở lượt đánh bài cần thêm tùy biến linh hoạt theo từng cấp độ kỹ năng của người chơi."
        ]
      },
      {
        id: "roadmap",
        title: "Hướng phát triển",
        icon: "🚀",
        tag: "LỘ TRÌNH TƯƠNG LAI",
        items: [
          "Phát triển hệ thống Bot AI mô phỏng nhiều trường phái tính toán khác nhau, hỗ trợ luyện tập cá nhân hóa.",
          "Bổ sung hệ thống đấu xếp hạng (Ranked Match), bảng vàng vinh danh và giải đấu giao hữu trực tuyến.",
          "Tối ưu hóa giao thức truyền thông điệp mạng, bổ sung tính năng tự động tái kết nối bảo toàn trạng thái ván bài.",
          "Mở rộng thêm các gói thẻ toán học nâng cao (Giải tích, Ma trận) phục vụ mục tiêu học tập và giải trí chuyên sâu."
        ]
      }
    ],
    // Mảng trích dẫn người chơi thử nghiệm (để rỗng [] theo yêu cầu, chỉ render khi có phần tử)
    playtestQuotes: []
  },

  // 7. THƯ VIỆN MEDIA & NHẬN DIỆN THƯƠNG HIỆU
  media: {
    sectionBadge: "THƯ VIỆN MEDIA",
    sectionTitle: "THƯ VIỆN ĐA PHƯƠNG TIỆN",
    sectionSubtitle: "Bộ nhận diện thương hiệu, font chữ tự thiết kế, hình ảnh và hoạt họa",
    fontShowcase: {
      title: "BỘ NHẬN DIỆN & FONT CHỮ TỰ THIẾT KẾ",
      alphabetImg: "assets/logo/BangChu_Mathicard.png",
      alphabetPlaceholderImg: "assets/logo/BangChu_Mathicard_placeholder.png",
      logoNgangImg: "assets/logo/Logo_Mathicard_Ngang.png",
      logoIconImg: "assets/logo/Logo_Mathicard_Icon.png",
      logoIconPlaceholderImg: "assets/logo/Logo_Mathicard_Icon_placeholder.png",
      conceptNote: "Font chữ Pixel 8-bit được nhóm tự xây dựng trên hệ thống lưới (pixel grid) đồng nhất, thiết kế riêng để tối ưu độ tương phản trên màn hình game Godot 4 và giao diện web. Font hỗ trợ trọn vẹn 100% các ký tự tiếng Việt có dấu phức tạp như Đánh giá, Bốc bài, Cửa hàng, Tính điểm.",
      paletteSwatches: [
        { name: "Deep Teal Base", hex: "#0b1320", role: "Nền vũ trụ tối" },
        { name: "Card Panel Navy", hex: "#162a45", role: "Nền khung thẻ bài" },
        { name: "Swirl Emerald", hex: "#2a9d8f", role: "Luồng xoáy năng lượng" },
        { name: "Coral Amber", hex: "#e76f51", role: "Màu ấm tương phản" },
        { name: "Gold Score", hex: "#f4a261", role: "Điểm & Tiền vàng" },
        { name: "Crimson Spark", hex: "#e63946", role: "Toán tử & Thẻ đỏ" }
      ]
    },
    imagesGrid: [
      {
        id: "ss-01",
        src: "assets/screens/SS_01_TrangChu.webp",
        alt: "Màn hình Trang chủ Mathicard",
        caption: "Trang chủ: Giao diện chính và lựa chọn chế độ chơi"
      },
      {
        id: "ss-02",
        src: "assets/screens/SS_02_TaoPhong.webp",
        alt: "Thiết lập phòng đấu 2–4 người",
        caption: "Tạo phòng: Tùy chỉnh phòng đấu và số lượng người tham gia"
      },
      {
        id: "ss-03",
        src: "assets/screens/SS_03_PhongCho.webp",
        alt: "Phòng chờ thi đấu",
        caption: "Phòng chờ: Tập hợp người chơi và chuẩn bị bắt đầu trận"
      },
      {
        id: "ss-04",
        src: "assets/screens/SS_04_ChonBoBai.webp",
        alt: "Chọn bộ bài chiến thuật",
        caption: "Chọn bộ bài: Lựa chọn bộ bài khởi đầu cho ván đấu"
      },
      {
        id: "ss-05",
        src: "assets/screens/SS_05_BocBai.webp",
        alt: "Giai đoạn Bốc bài",
        caption: "Lượt 1 – Bốc bài: Rút 8 thẻ số và nhận toán tử cơ bản"
      },
      {
        id: "ss-06",
        src: "assets/screens/SS_06_DanhBai.webp",
        alt: "Giai đoạn Đánh bài & Ghép phép tính",
        caption: "Lượt 3 – Đánh bài: Ghép biểu thức tiệm cận mục tiêu và Chốt"
      },
      {
        id: "ss-07",
        src: "assets/screens/SS_07_TinhDiem.webp",
        alt: "Giai đoạn Tính điểm & Kết quả",
        caption: "Lượt 4 – Tính điểm: So khớp kết quả và trao thưởng Coin"
      },
      {
        id: "ss-08",
        src: "assets/screens/SS_08_CuaHang.webp",
        alt: "Cửa hàng mua sắm vật phẩm",
        caption: "Lượt 5 – Cửa hàng: Mua Khóa học, gói thẻ và Đổi mới"
      },
      {
        id: "ss-09",
        src: "assets/screens/SS_09_ChiTietThe.webp",
        alt: "Thông số chi tiết thẻ bài",
        caption: "Chi tiết thẻ: Xem thông tin và cơ chế hiệu ứng bổ trợ"
      },
      {
        id: "ss-10",
        src: "assets/screens/SS_10_MoGoi.webp",
        alt: "Hoạt họa mở gói thẻ bài",
        caption: "Mở gói thẻ: Khám phá các thẻ bài ngẫu nhiên mới"
      },
      {
        id: "ss-11",
        src: "assets/screens/SS_11_KetThuc.webp",
        alt: "Tổng kết ván đấu",
        caption: "Kết thúc ván: Vinh danh người chiến thắng đạt điểm phòng"
      },
      {
        id: "ss-promo",
        src: "assets/images/PromoBanner.png",
        alt: "Poster quảng bá Mathicard",
        caption: "Poster quảng bá chính thức của game Mathicard"
      }
    ],
    animatedGrid: [
      {
        id: "gif-1",
        src: "assets/gif/Anim_LatBai.gif",
        alt: "Hiệu ứng lật thẻ bài 2 mặt",
        caption: "Sprite Animation: Hiệu ứng lật thẻ bài hai mặt (9 khung hình)"
      },
      {
        id: "gif-2",
        src: "assets/gif/Anim_Logo.gif",
        placeholderSrc: "assets/gif/Anim_Logo_placeholder.gif",
        alt: "Animation logo Mathicard",
        caption: "Logo Animation: Hiệu ứng chuyển động logo"
      }
    ]
  },

  // 8. TÀI LIỆU HỌC THUẬT BTL CÔNG NGHỆ ĐA PHƯƠNG TIỆN
  academicDocs: {
    sectionBadge: "TÀI LIỆU HỌC THUẬT",
    sectionTitle: "TÀI LIỆU HỌC THUẬT BTL",
    sectionSubtitle: "Các sản phẩm nghiên cứu, bản dịch giáo trình và mã nguồn của nhóm",
    notice: "Trình duyệt hỗ trợ xem trực tiếp bản PDF trong modal. Bấm 'Xem trực tuyến' để đọc hoặc 'Tải về' để lưu tệp gốc.",
    deliverables: [
      {
        id: "doc-dich",
        title: "Bản Dịch: Sách Fundamentals of Multimedia",
        scope: "Chương 11 (MPEG-1, 2, 4, 7) & Chương 12 (H.264, H.265)",
        author: "Lê Hoàng Cường",
        description: "Dịch thuật học thuật chi tiết chuẩn nén video liên khung, ước lượng chuyển động và thuật toán mã hóa entropy.",
        pdfFile: "docs/Dich_Ch11_12.pdf",
        downloadFile: "docs/Dich_Ch11_12.docx",
        isReady: true,
        tag: "Bản dịch sách"
      },
      {
        id: "doc-nc22",
        title: "Nghiên Cứu 2.2: Các Bước Nén Mất Dữ Liệu",
        scope: "Chuyên đề nén mất dữ liệu (Lossy Compression) trong JPEG & MPEG",
        author: "Phạm Quốc Dũng",
        description: "Phân tích sâu bước lượng tử hóa (Quantization) và lấy mẫu sắc độ gây suy hao chất lượng trong nén ảnh và video.",
        pdfFile: "docs/NC_2.2_JPEG_MPEG.pdf",
        downloadFile: "docs/NC_2.2_JPEG_MPEG.docx",
        isReady: true,
        tag: "Báo cáo nghiên cứu"
      },
      {
        id: "doc-nc23",
        title: "Nghiên Cứu 2.3: Lưu Trữ, Phát Lại & Truyền Video",
        scope: "Hạ tầng lưu trữ và truyền phát luồng video số trực tuyến",
        author: "Phạm Quốc Dũng",
        description: "Khảo sát kỹ thuật streaming thích ứng DASH/HLS, bộ đệm phát lại và giao thức truyền tải đa phương tiện.",
        pdfFile: "docs/NC_2.3_Video.pdf",
        downloadFile: "docs/NC_2.3_Video.docx",
        isReady: true,
        tag: "Báo cáo nghiên cứu"
      },
      {
        id: "doc-demo",
        title: "Mã Nguồn Demo: Thuật Toán Nén Đa Phương Tiện",
        scope: "Jupyter Notebook trực quan hóa biến đổi DCT & ma trận lượng tử",
        author: "Phạm Quốc Dũng",
        description: "Chương trình Python thực thi thuật toán nén ảnh JPEG và biểu diễn ma trận lượng tử hóa độ sáng tiêu chuẩn.",
        pdfFile: "", // File ipynb tải trực tiếp
        downloadFile: "docs/Demo_Nen.ipynb",
        isReady: true,
        tag: "Mã nguồn Python"
      },
      {
        id: "doc-slide",
        title: "Slide Báo Cáo Thuyết Trình Bài Tập Lớn",
        scope: "Bộ slide thuyết trình đồ án trước hội đồng môn học",
        author: "Nguyễn Văn An",
        description: "Bản trình chiếu tóm lược nội dung game Mathicard, bản dịch chương 11–12 và kết quả nghiên cứu công nghệ video.",
        pdfFile: "docs/Slide_68PM1_NhomXX.pdf",
        downloadFile: "docs/Slide_68PM1_NhomXX.pptx",
        isReady: true,
        tag: "Slide thuyết trình"
      }
    ]
  },

  // 9. THÀNH VIÊN NHÓM & PHÂN CÔNG CÔNG VIỆC
  team: {
    sectionBadge: "THÀNH VIÊN NHÓM",
    sectionTitle: "THÀNH VIÊN & PHÂN CÔNG",
    sectionSubtitle: "Thông tin nhóm sinh viên thực hiện bài tập lớn môn Công nghệ đa phương tiện",
    classInfo: "Lớp: 68PM1 · Nhóm: XX",
    faculty: "Khoa Công nghệ Thông tin · Trường Đại học Xây dựng Hà Nội",
    members: [
      {
        stt: 1,
        name: "Nguyễn Văn An",
        role: "Trưởng nhóm",
        tasks: "Xây dựng Website quảng bá tĩnh, Thiết kế Slide thuyết trình, Soát lỗi & Tổng hợp hồ sơ nộp bài",
        status: "Hoàn thành"
      },
      {
        stt: 2,
        name: "Trần Minh Bảo",
        role: "Phụ trách Media",
        tasks: "Thiết kế Logo với font chữ riêng, Xử lý hình ảnh, Tạo ảnh động (GIF), Dựng Video lồng tiếng & Phụ đề VTT",
        status: "Đang cập nhật video"
      },
      {
        stt: 3,
        name: "Lê Hoàng Cường",
        role: "Dịch thuật tài liệu",
        tasks: "Dịch Fundamentals of Multimedia Chương 11 (MPEG) & 12 (H.264/H.265), Xây dựng bảng thuật ngữ chuyên ngành",
        status: "Hoàn thành"
      },
      {
        stt: 4,
        name: "Phạm Quốc Dũng",
        role: "Nghiên cứu & Kỹ thuật",
        tasks: "Báo cáo Nghiên cứu 2.2 (Nén JPEG/MPEG) & 2.3 (Truyền video), Xây dựng mã nguồn Demo nén ảnh Jupyter Notebook",
        status: "Hoàn thành"
      }
    ]
  },

  // 10. CHÂN TRANG (FOOTER)
  footer: {
    brand: "MATHICARD",
    copyright: "© 2026 Mathicard Game Studio. Bài tập lớn môn Công nghệ đa phương tiện.",
    credit: "Sản phẩm học tập được phát triển bởi Nhóm sinh viên Lớp 68PM1.",
    navLinks: [
      { label: "Giới thiệu", href: "#gioi-thieu" },
      { label: "Trailer", href: "#trailer" },
      { label: "Bộ thẻ bài", href: "#cac-loai-the" },
      { label: "Đánh giá", href: "#danh-gia" },
      { label: "Media", href: "#media" },
      { label: "Tài liệu", href: "#tai-lieu" },
      { label: "Nhóm", href: "#nhom" }
    ]
  }
};
