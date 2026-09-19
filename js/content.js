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
    // Dãy thẻ bài xòe quạt tương tác ở Hero (5-7 thẻ số + toán tử, không dùng mặt sau)
    fannedCards: [
      {
        id: "hero-1",
        title: "Thẻ Số 1",
        image: "assets/cards/val_1.webp",
        type: "value"
      },
      {
        id: "hero-2",
        title: "Toán tử Cộng (+)",
        image: "assets/cards/op_plus.webp",
        type: "operator"
      },
      {
        id: "hero-3",
        title: "Thẻ Số 5",
        image: "assets/cards/val_5.webp",
        type: "value"
      },
      {
        id: "hero-4",
        title: "Toán tử Nhân (×)",
        image: "assets/cards/op_multiply.webp",
        type: "operator"
      },
      {
        id: "hero-5",
        title: "Thẻ Số 7 Hoàng Kim",
        image: "assets/cards/val_7.webp",
        type: "value"
      },
      {
        id: "hero-6",
        title: "Toán tử Trừ (−)",
        image: "assets/cards/op_minus.webp",
        type: "operator"
      },
      {
        id: "hero-7",
        title: "Thẻ Số 9 Cực Đại",
        image: "assets/cards/val_9.webp",
        type: "value"
      }
    ]
  },

  // 3. VIDEO TRAILER & PHỤ ĐỀ
  trailer: {
    sectionTitle: "TRAILER GAME & GAMEPLAY",
    sectionSubtitle: "Video giới thiệu và hướng dẫn luật chơi Mathicard dưới 30 giây",
    videoSrc: "assets/video/Video_Mathicard_NoSub.mp4",
    posterImg: "assets/images/KeyArt.webp",
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
        name: "Bốc bài",
        subtitle: "Giai đoạn Bốc bài",
        iconImg: "assets/images/Luot_01.webp",
        iconAlt: "Giai đoạn 1: Bốc bài",
        brief: "Rút đủ 8 lá bài số lên tay từ cọc bài và nhận 4 lá bài dấu cơ bản (+, −, ×, ÷) vào khung toán tử.",
        detail: "Mỗi người chơi bắt đầu với cọc bài 36 lá số (1–9, mỗi số 4 lá). Khung toán tử lưu trữ các phép tính cơ bản hoặc nâng cao được mua từ Cửa hàng."
      },
      {
        id: 2,
        stepNumber: "02",
        name: "Sinh giá trị",
        subtitle: "Giai đoạn Sinh giá trị",
        iconImg: "assets/images/Luot_02.webp",
        iconAlt: "Giai đoạn 2: Sinh giá trị",
        brief: "Hệ thống tự động phát sinh một số nguyên ngẫu nhiên làm giá trị mục tiêu cho toàn bộ người chơi.",
        detail: "Tất cả người chơi trong phòng đều chung một mục tiêu số này. Tốc độ và tư duy ghép phép tính tiệm cận quyết định vị thế thắng bại."
      },
      {
        id: 3,
        stepNumber: "03",
        name: "Đánh bài",
        subtitle: "Giai đoạn Đánh bài",
        iconImg: "assets/images/Luot_03.webp",
        iconAlt: "Giai đoạn 3: Đánh bài",
        brief: "Đặt thẻ số và toán tử thành một biểu thức toán học hợp lệ sao cho kết quả gần giá trị mục tiêu nhất.",
        detail: "Người chơi có thể kích hoạt thêm các thẻ vật phẩm, thẻ giáo trình hoặc hình dán bổ trợ để nhân đôi điểm hoặc biến đổi số linh hoạt."
      },
      {
        id: 4,
        stepNumber: "04",
        name: "Tính điểm",
        subtitle: "Giai đoạn Tính điểm",
        iconImg: "assets/images/Luot_04.webp",
        iconAlt: "Giai đoạn 4: Tính điểm",
        brief: "So sánh độ lệch của biểu thức so với mục tiêu; trao thưởng điểm phòng, tiền Coin và BCoin danh giá.",
        detail: "Người về Nhất giành nhiều điểm phòng nhất để tiến gần chiến thắng chung cuộc, đồng thời tích lũy Coin và BCoin chuẩn bị cho vòng mua sắm."
      },
      {
        id: 5,
        stepNumber: "05",
        name: "Cửa hàng",
        subtitle: "Giai đoạn Cửa hàng",
        iconImg: "assets/images/Luot_05.webp",
        iconAlt: "Giai đoạn 5: Cửa hàng",
        brief: "Sử dụng Coin và BCoin mua sắm thẻ phép, thẻ vật phẩm mới, gói thẻ nâng cấp hoặc thay đổi toán tử.",
        detail: "Sau khi hết thời gian Cửa hàng, ván đấu lập tức quay lại Lượt 1 (Bốc bài) với sức mạnh bộ bài mới cho đến khi tìm ra người chiến thắng!"
      }
    ]
  },

  // 5. BỘ SƯU TẬP THẺ BÀI (GALLERY)
  cardGallery: {
    sectionBadge: "BỘ SƯU TẬP THẺ",
    sectionTitle: "BỘ SƯU TẬP THẺ BÀI",
    sectionSubtitle: "Khám phá hệ thống thẻ bài đa dạng: Số học, Toán tử, Thẻ phép & Bộ bài",
    categories: [
      { key: "all", label: "Tất cả thẻ" },
      { key: "value", label: "Thẻ Giá trị" },
      { key: "operator", label: "Toán tử" },
      { key: "spell", label: "Thẻ Phép & Vật phẩm" },
      { key: "deck", label: "Bộ bài & Gói" }
    ],
    cards: [
      // THẺ GIÁ TRỊ (Số 1 đến 9)
      {
        id: "val-1",
        category: "value",
        name: "Thẻ Số 1",
        tag: "Số nguyên cơ bản",
        rarity: "Phổ thông",
        image: "assets/cards/val_1.webp",
        desc: "Thẻ số cơ bản giá trị 1. Thích hợp dùng làm bước đệm cho phép nhân chia hoặc tiệm cận sai số nhỏ."
      },
      {
        id: "val-3",
        category: "value",
        name: "Thẻ Số 3",
        tag: "Số lẻ chiến thuật",
        rarity: "Phổ thông",
        image: "assets/cards/val_3.webp",
        desc: "Thẻ số 3 linh hoạt. Dễ dàng kết hợp với toán tử nhân và số mũ để tạo bước nhảy giá trị lớn."
      },
      {
        id: "val-5",
        category: "value",
        name: "Thẻ Số 5",
        tag: "Số mốc tròn chục",
        rarity: "Phổ thông",
        image: "assets/cards/val_5.webp",
        desc: "Thẻ số 5 trung tâm. Giúp định hình các phép tính tiệm cận mốc hàng chục nhanh chóng và an toàn."
      },
      {
        id: "val-7",
        category: "value",
        name: "Thẻ Số 7",
        tag: "Số Hoàng Kim",
        rarity: "Hiếm",
        image: "assets/cards/val_7.webp",
        desc: "Lá số may mắn 7. Kích hoạt combo thần tài khi kết hợp cùng thẻ vật phẩm Jackpot trên bàn đấu."
      },
      {
        id: "val-9",
        category: "value",
        name: "Thẻ Số 9",
        tag: "Số cực đại",
        rarity: "Hiếm",
        image: "assets/cards/val_9.webp",
        desc: "Thẻ số có giá trị tự nhiên cao nhất trong cọc bài cơ bản. Đem lại đột biến lớn khi nhân dồn."
      },

      // TOÁN TỬ (+, -, ×, ÷)
      {
        id: "op-plus",
        category: "operator",
        name: "Toán tử Cộng (+)",
        tag: "Nhị phân cơ bản",
        rarity: "Cốt lõi",
        image: "assets/cards/op_plus.webp",
        desc: "Phép cộng nhị phân tiêu chuẩn. Tích lũy giá trị từng bước nhỏ để tiến sát mục tiêu với độ chính xác cao."
      },
      {
        id: "op-minus",
        category: "operator",
        name: "Toán tử Trừ (−)",
        tag: "Nhị phân cơ bản",
        rarity: "Cốt lõi",
        image: "assets/cards/op_minus.webp",
        desc: "Phép trừ số học. Khắc chế các biểu thức vượt quá giá trị mục tiêu, hạ thấp sai số về mức 0."
      },
      {
        id: "op-mult",
        category: "operator",
        name: "Toán tử Nhân (×)",
        tag: "Nhị phân khuếch đại",
        rarity: "Cốt lõi",
        image: "assets/cards/op_multiply.webp",
        desc: "Phép nhân khuếch đại. Tạo ra những con số mục tiêu khổng lồ chỉ với 2 lá bài trên tay."
      },
      {
        id: "op-div",
        category: "operator",
        name: "Toán tử Chia (÷)",
        tag: "Nhị phân thu nhỏ",
        rarity: "Cốt lõi",
        image: "assets/cards/op_divide.webp",
        desc: "Phép chia lấy nguyên. Rất hữu ích khi đối đầu với các số mục tiêu phân đoạn nhỏ hoặc cân bằng giá trị."
      },

      // THẺ PHÉP & VẬT PHẨM (Items)
      {
        id: "item-rainbow",
        category: "spell",
        name: "Cầu vồng (Rainbow)",
        tag: "Thẻ vật phẩm",
        rarity: "Hiếm (Rare)",
        image: "assets/cards/item_rainbow.webp",
        desc: "Cộng thêm điểm thưởng lớn và xu khi biểu thức trên bàn sở hữu đủ 4 màu thẻ số khác biệt."
      },
      {
        id: "item-jackpot",
        category: "spell",
        name: "Jackpot 777",
        tag: "Thẻ vật phẩm",
        rarity: "Sử thi (Epic)",
        image: "assets/cards/item_jackpot.webp",
        desc: "Thưởng điểm tối đa cho người chơi nếu kết hợp thành công ba lá bài số 7 trong cùng một lượt."
      },
      {
        id: "item-tetris",
        category: "spell",
        name: "Tetris",
        tag: "Thẻ vật phẩm",
        rarity: "Hiếm (Rare)",
        image: "assets/cards/item_tetris.webp",
        desc: "Kích hoạt hiệu ứng cộng hưởng khi đặt các thẻ bài có hình dán tương thích nằm cạnh nhau."
      },
      {
        id: "item-anvil",
        category: "spell",
        name: "Cái Đe (The Anvil)",
        tag: "Thẻ nâng cấp",
        rarity: "Sử thi (Epic)",
        image: "assets/cards/item_anvil.webp",
        desc: "Rèn và dung hợp 3 thẻ vật phẩm thông thường thành 1 thẻ vật phẩm ngẫu nhiên bậc Huyền thoại."
      },
      {
        id: "item-pawn",
        category: "spell",
        name: "Con Tốt (Pawn)",
        tag: "Thẻ cờ vua",
        rarity: "Phổ thông",
        image: "assets/cards/item_pawn.webp",
        desc: "Di chuyển 1 ô sang phải sau mỗi lượt đấu; tự động phong cấp thành Hậu khi đến cuối hàng trang bị."
      },
      {
        id: "item-satellite",
        category: "spell",
        name: "Vệ Tinh (Satellite)",
        tag: "Thẻ cơ động",
        rarity: "Hiếm (Rare)",
        image: "assets/cards/item_satellite.webp",
        desc: "Tự động đổi vị trí ngẫu nhiên mỗi vòng; tăng gấp đôi chỉ số cho các thẻ vật phẩm lân cận."
      },

      // BỘ BÀI & GÓI BÀI (Decks & Packs)
      {
        id: "deck-base",
        category: "deck",
        name: "Bộ Bài Mặc Định (Basedeck)",
        tag: "Bộ bài khởi đầu",
        rarity: "Cơ bản",
        image: "assets/cards/deck_base.webp",
        desc: "Bộ bài tiêu chuẩn 36 lá số từ 1 đến 9 cân bằng, là nền tảng chiến thuật cho mọi tân thủ."
      },
      {
        id: "deck-gold",
        category: "deck",
        name: "Bộ Bài Hoàng Kim (Golddeck)",
        tag: "Bộ bài mở rộng",
        rarity: "Huyền thoại",
        image: "assets/cards/deck_gold.webp",
        desc: "Tăng 50% lượng Coin kiếm được sau mỗi vòng và gia tăng tỉ lệ rút thẻ số 7, 8, 9."
      },
      {
        id: "deck-purple",
        category: "deck",
        name: "Bộ Bài Huyền Bí (Purpledeck)",
        tag: "Bộ bài mở rộng",
        rarity: "Sử thi",
        image: "assets/cards/deck_purple.webp",
        desc: "Khởi đầu trận với sẵn 1 thẻ phép biến ảo ngẫu nhiên; gia tăng thời gian suy nghĩ trong lượt đánh."
      },
      {
        id: "pack-starter",
        category: "deck",
        name: "Gói Thẻ Tân Thủ (Pack 1)",
        tag: "Gói mở rộng",
        rarity: "Phổ thông",
        image: "assets/cards/pack_1.webp",
        desc: "Mở khóa 3 thẻ bài số ngẫu nhiên cùng cơ hội nhận các thẻ bổ trợ sơ cấp trong Cửa hàng."
      },
      {
        id: "pack-advanced",
        category: "deck",
        name: "Gói Thẻ Nâng Cao (Pack 2)",
        tag: "Gói mở rộng",
        rarity: "Hiếm",
        image: "assets/cards/pack_2.webp",
        desc: "Chứa các thẻ phép thuật biến đổi dấu, hỗ trợ lội ngược dòng ngoạn mục ở những vòng đấu quyết định."
      }
    ]
  },

  // 6. ĐÁNH GIÁ & NHẬN XÉT (REVIEW)
  review: {
    sectionBadge: "ĐÁNH GIÁ",
    sectionTitle: "ĐÁNH GIÁ CHUYÊN MÔN",
    sectionSubtitle: "Nhận xét và phân tích chất lượng game từ góc nhìn đồ án đa phương tiện",
    cardCoverText: "CHẠM HOẶC CUỘN ĐỂ LẬT THẺ XEM ĐIỂM",
    overallScore: 8.5,
    maxScore: 10,
    quote: "Mathicard là sự kết hợp táo bạo và sáng tạo giữa tính toán số học phản xạ nhanh với cơ chế xây dựng bộ bài qua cửa hàng giữa các vòng. Trò chơi chứng minh rằng toán học có thể trở thành một trải nghiệm giải trí đối kháng cực kỳ gay cấn!",
    subScores: [
      { label: "Lối chơi & Tính cân bằng", score: 9.0, percent: 90 },
      { label: "Đồ họa Retro Pixel & Hiệu ứng", score: 8.5, percent: 85 },
      { label: "Tính giáo dục & Rèn luyện phản xạ", score: 9.0, percent: 90 },
      { label: "Trải nghiệm đối kháng bạn bè (2–4 người)", score: 8.0, percent: 80 }
    ],
    pros: [
      "Vòng lặp 5 giai đoạn chặt chẽ, dồn dập, không gây nhàm chán.",
      "Hệ thống thẻ bài phong phú, tạo ra hàng ngàn combo toán học biến ảo.",
      "Đồ họa retro pixel chunky bắt mắt, tương thích mượt mà cả trên Web và Mobile.",
      "Tích hợp cả hai đơn vị tiền tệ Coin và BCoin giúp kinh tế trong game có chiều sâu."
    ],
    cons: [
      "Đòi hỏi kết nối mạng ổn định cho phòng đấu 2–4 người chơi đồng thời.",
      "Cần thêm các chế độ đấu tập (AI bot) cho người chơi mới làm quen luật."
    ]
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
        id: "img-promo",
        src: "assets/images/PromoBanner.png",
        alt: "Poster quảng bá Mathicard",
        caption: "Poster quảng bá chính thức của game Mathicard"
      },
      {
        id: "img-1",
        src: "assets/images/KeyArt.webp",
        alt: "Key Art Mathicard chính thức",
        caption: "Key Art: Đấu trường toán học Mathicard (Đồ họa 16:9)"
      },
      {
        id: "img-2",
        src: "assets/images/CardShowcase.webp",
        alt: "Showcase các bộ bài và gói mở rộng",
        caption: "Showcase: Hệ thống 6 bộ bài và các gói thẻ nâng cấp"
      },
      {
        id: "img-3",
        src: "assets/images/DanhGia.webp",
        alt: "Bảng đánh giá chuyên môn 8.5/10",
        caption: "Infographic: Bảng đánh giá và phân tích chuyên môn"
      },
      {
        id: "img-4",
        src: "assets/images/Luot_03.webp",
        alt: "Giai đoạn đánh bài và ghép toán tử",
        caption: "Gameplay: Giai đoạn Đánh bài & Ghép biểu thức tiệm cận"
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
